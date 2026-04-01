import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import bpo from '../../Backend/bpo.fetch';
import {
	FaBoxOpen,
	FaWarehouse,
	FaRegCalendarAlt,
	FaFileDownload,
	FaCheckCircle
} from 'react-icons/fa';
import { MdOutlineDescription } from 'react-icons/md';
import ComponentHeader from '../../components/ComponentHeader';
import Input from '../../components/inputs/Input';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { currencyFormatter } from '../../utils/currencyFormatter';
import fetchData from '../../Backend/fetchData.backend';
import RHSelect from '../../components/inputs/RHF/Select.RHF';
import TextArea from '../../components/inputs/TextArea';
import SearchableSelect from '../../components/inputs/SearchableSelect';
import Loader from '../../components/loader/Loader';
import masterData from '../../Backend/master.backend';
import AddModal from '../../components/Add.modal';
import CreateStoreForm from '../../components/admin/Store/CreateStoreForm';
import RealseOrderPreview from './ReleaseOrderPreview';


const headerLink = [
	{ title: "Blanket PO", link: "/order/bpo" },
	{ title: "Details" },
]

const PRIORITY = [
	{ label: "Urgent", value: "urgent" },
	{ label: "High", value: "high" },
	{ label: "Medium", value: "medium" },
	{ label: "Low", value: "low" },
]


const BPODetailsPage = () => {
	const { id } = useParams();

	const [store, setStore] = useState(null);
	const [isPreviewShow, setIsPreviewShow] = useState(false);
	const [formData, setFormData] = useState(null);

	const { data: bpoList, isLoading: bpoListLoading } = bpo.TQBlanketOrderItem(id, Boolean(id));
	const isEmpty = bpoList?.data?.length > 0 ? false : true;

	const { data: storeList, isLoading: storeListLoading } = fetchData.TQStoreList({ store_type: "rm_store", isAdmin: true }, Boolean(id));

	const bpoData = bpoList?.data;
	// console.log(bpoData)

	const { handleSubmit, reset, register, formState: { errors }, setValue, control, watch } = useForm({
		defaultValues: {
			items: [],
			target_store_id: "",
			required_by: "",
			instructions: ""
		}
	});

	const { fields, replace } = useFieldArray({
		control,
		name: "items",
	})

	/** setup form values */
	useEffect(() => {
		if (bpoData?.blanketOrderItems) {
			const initialItems = bpoData.blanketOrderItems.map(item => ({
				bpo_item_id: item.id, // reference to original ID

				buyer_product_id: item.buyer_product_id,
				vendor_product_id: item.vendor_product_id,

				product: item.product,
				unit_price: item.unit_price,
				total_qty: item.total_contracted_qty,
				remaining_qty: item.remain_contracted_qty || item.total_contracted_qty,
				release_qty: null
			}));
			replace(initialItems);
		}
	}, [bpoData, replace]);

	const watchedItems = watch("items");
	const totalAmount = watchedItems?.reduce((acc, item) => {
		const qty = parseFloat(item.release_qty) || 0;
		return acc + (qty * item.unit_price);
	}, 0) || 0;


	async function submitData(data) {
		// Filter: only items where release_qty is filled (> 0)
		const selectedItems = data.items.filter(item => {
			const qty = parseFloat(item.release_qty);
			return qty > 0;
		});

		if (selectedItems.length === 0) {
			alert("Please enter release qty for at least one item");
			return;
		}

		data.items = selectedItems;
		data.bpo_no = bpoData?.bpo_no;
		data.grand_total = selectedItems.reduce((acc, item) => {
			return acc + (parseFloat(item.release_qty) * item.unit_price);
		}, 0);

		// console.log("Form Data: ", data);
		setFormData(data);
		setIsPreviewShow(true);
	}


	if (bpoListLoading) return <Loader />;

	return (
		<>
			<form onSubmit={handleSubmit(submitData)} className=" font-sans">
				{/* Header Section */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
					<div>
						<ComponentHeader
							headerLink={headerLink}
							showSearch={false}
						/>
						<h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
							{bpoData?.bpo_no} <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full uppercase tracking-wider font-bold">Active</span>
						</h1>
					</div>

					<div className="flex gap-3">
						<button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all font-medium">
							<FaFileDownload className="text-gray-400" size={25} />
							Download Contract
						</button>
						<button className="flex items-center gap-2 px-6 py-2 bg-[#0052CC] text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all font-semibold">
							<FaCheckCircle size={25} />
							Confirm Release Order Preview
						</button>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column: Contract Info & Item Selection */}
					<div className="lg:col-span-2 space-y-6 order-2 lg:order-1">

						{/* Item List / Selection Table */}
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
							<div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
								<h2 className="font-bold text-gray-800 text-lg">Contracted Items</h2>
								<span className="text-sm text-gray-500">{bpoData?.blanketOrderItems?.length} Products</span>
							</div>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-gray-50/50">
										<tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
											<th className="px-6 py-4">Product Info</th>
											<th className="px-6 py-4">Total Qty / PO Qty</th>
											<th className="px-6 py-4">Remaining Qty</th>
											<th className="px-6 py-4">Unsettled Qty</th>
											<th className="px-6 py-4 text-[#0052CC]">Release Qty</th>
											<th className="px-6 py-4">Line Total</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-50">
										{fields?.map((item, index) => {
											// 1. Get the current quantity from watchedItems
											const currentQty = parseFloat(watchedItems?.[index]?.release_qty) || 0;

											// 2. Calculate the line total
											const currentLineTotal = currentQty * item.unit_price;

											return (
												<tr key={item.id} className="hover:bg-blue-50/20 transition-colors">
													<td className="px-6 py-6">
														<div className="flex items-center gap-4">
															<div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
																<FaBoxOpen size={20} />
															</div>
															<div>
																<div className="font-bold text-gray-900">{item?.product.name}</div>
																<div className="text-xs text-gray-500">Fixed Price: {currencyFormatter(item.unit_price)}</div>
															</div>
														</div>
													</td>
													<td className="px-6 py-6 text-gray-600 font-medium">{item.total_qty} {item?.product?.unit_type}</td>
													<td className="px-6 py-6">
														<span className="text-green-600 font-bold">{item.remaining_qty} {item?.product?.unit_type}</span>
													</td>
													<td className="px-6 py-6 text-danger font-medium">{bpoData?.blanketOrderItems?.[index]?.unsettled_qty} {item?.product?.unit_type}</td>
													<td className="px-6 py-6">
														<input
															step="any"
															{...register(`items.${index}.release_qty`, {
																min: { value: 0, message: "Minimum is 0" },
																max: { value: item.remaining_qty, message: `Maximum is ${item.remaining_qty}` },
															})}
															placeholder="0.00"
															className="w-32 border-2 border-gray-100 rounded-xl px-3 py-2 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-blue-700"
														/>
														{errors?.items?.[index]?.release_qty && (
															<span className='text-danger text-xs block mt-1'>{errors.items[index].release_qty.message}</span>
														)}
													</td>
													{/* 3. Display the formatted Line Total */}
													<td className="px-6 py-6 font-bold text-gray-900">
														{currencyFormatter(currentLineTotal)}
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>
					</div>

					{/* Right Column: Release Context & Store Selection */}
					<div className="space-y-6 order-1 lg:order-2">
						<div className="bg-white px-8 py-4 rounded-2xl shadow-xl border border-gray-100 sticky top-8">
							<h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
								Release Order Settings
							</h3>

							<div className="space-y-4">
								{/* Target Warehouse Selection */}
								<div>
									<Controller
										name="target_store_id"
										rules={{
											required: "This field is required!!!"
										}}
										control={control}
										render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
											<RHSelect
												ref={(el) => {
													ref({
														focus: () => el?.focus(),
													});
												}}
												value={value}
												onChange={onChange}
												isSearchable={false}

												label="Target Store (Buyer Side)"
												options={storeList?.data}

												required={true}
												error={error?.message}

												addButton={true}
												buttonTitle="Add"
												buttonOnClick={() => setStore("RAW")}
											/>
										)}
									/>
								</div>

								{/* required date */}
								<div>
									<Input
										type="date"
										label="Delivery Required By"
										// labelPosition="inline"
										{...register("required_by")}
									/>
								</div>

								{/* Target Warehouse Selection */}
								<div>
									<Controller
										name="priority"
										control={control}
										render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
											<SearchableSelect
												ref={(el) => {
													ref({
														focus: () => el?.focus(),
													});
												}}
												value={value}
												onChange={onChange}
												isSearchable={false}

												label="Priority"
												options={PRIORITY}
											/>
										)}
									/>
								</div>

								{/* Priority / Shipping Note */}
								<div className="">
									<TextArea
										label="Dispatch Instructions (Optional)"
										placeholder="e.g. Fragile items, pack in wooden crates..."
										{...register("instructions")}
									/>
								</div>

								<div className="border-t border-gray-100">
									<div className="flex justify-between items-center mb-2">
										<span className="text-gray-500 text-sm">Release Order Total (Approx)</span>
										<span className="text-xl font-bold text-gray-900">{currencyFormatter(totalAmount)}</span>
									</div>
									<p className="text-[10px] text-gray-400 leading-tight">
										By confirming, you are issuing a legally binding Release Order against BPO {bpoData?.bpo_no}.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</form>

			<AddModal
				isShow={Boolean(store)}
				setIsShow={setStore}
				title={"Add New RM Store"}
				maxWidth='75'
			>
				<CreateStoreForm
					selectedStore={store}
					setSelectedStore={setStore}
					isTypeDisabled={true}
				/>
			</AddModal>

			<AddModal
				isShow={isPreviewShow}
				setIsShow={setIsPreviewShow}
				title="Release order preview"
				maxWidth='85'
			// dark={true}
			>
				<RealseOrderPreview
					formData={formData}
					setFormData={setFormData}
					setIsShow={setIsPreviewShow}
					rhfSetValue={setValue}
					allFields={fields}
				/>
			</AddModal>
		</>
	);
};

export default BPODetailsPage;