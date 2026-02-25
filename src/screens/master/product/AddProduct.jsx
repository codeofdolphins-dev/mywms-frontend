import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import FileUpload from '@/components/inputs/File';
import { Button } from '@mantine/core';
import { Link, useNavigate, useParams } from 'react-router-dom';
import fetchData from '@/Backend/fetchData.backend';
import masterData from '@/Backend/master.backend';
import { RHFToFormData } from '@/utils/RHFtoFD';
import CategoryTree from '../../../components/CategoryTree';
import { successAlert } from '@/utils/alerts';
import FullScreenLoader from '@/components/loader/FullScreenLoader';
import AddModal from '@/components/Add.modal';
import BrandForm from '@/components/brand/Form';
import HSNForm from '@/components/HSN/HSN.Form';
import CategoryForm from '@/components/category/CategoryForm';
import UnitTypeForm from '@/components/unit/UnitType.Form';
import PackageTypeForm from '@/components/packageType/PackageType.Form';
import Input from '../../../components/inputs/Input';
import BooleanSwitch from '../../../components/inputs/BooleanSwitch';
import RHRadioGroup from '../../../components/inputs/RHF/RHRadioGroup';
import RHSelect from '../../../components/inputs/RHF/Select.RHF';
import TextArea from '../../../components/inputs/TextArea';


const AddProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [showBrand, setShowBrand] = useState(false);
    const [showHSN, setShowHSN] = useState(false);
    const [showCategory, setShowCategory] = useState(false);
    const [showUnitType, setShowUnitType] = useState(false);
    const [showPackageType, setShowPackageType] = useState(false);

    const { data: categoryData, isLoading: cateLoading } = fetchData.TQAllCategoryList({ noLimit: true });
    const { data: brandData, isLoading: brandLoading } = fetchData.TQAllBrandList({ noLimit: true });
    const { data: hsnData, isLoading: hsnLoading } = fetchData.TQAllHsnList({ noLimit: true });
    const { data: unitTypeData, isLoading: unitTypeLoading } = fetchData.TQUnitTypeList({ noLimit: true });
    const { data: packageTypeData, isLoading: packageTypeLoading } = fetchData.TQPackageTypeList({ noLimit: true });

    const param = id ? { id } : {};
    const { data: product, isLoading } = fetchData.TQProductList(param, Boolean(id));

    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster(["productList"]);
    const { mutateAsync: updateData, isPending: updatePending } = masterData.TQUpdateMaster(["productList"]);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue
    } = useForm();

    useEffect(() => {
        if (!id) return;

        if (product?.data?.[0]) {
            const data = product?.data?.[0];
            // console.log(data);
            reset({
                ...data,
                brands: data?.productBrands?.[0]?.id,
                categories: data?.selectedCategoryIds,
                hsn_id: data?.hsn?.id,
                unit_type_id: data?.unitRef?.id,
                package_type_id: data?.packageType?.id,
            })
        } else {
            reset();
        }

    }, [id, product, isLoading]);


    const submit = async (data) => {
        // console.log(data); return
        try {

            if (id) {
                data.id = id;
                const fd = RHFToFormData(data);
                const res = await updateData({ path: "/product/update", formData: fd });
                if (res.success) successAlert(res.message);
                reset();
                navigate(-1);

            } else {
                const fd = RHFToFormData(data);
                const res = await createData({ path: "/product/create-finish", formData: fd });
                if (res.success) successAlert(res.message);
                reset();
                navigate(-1);
            }

        } catch (error) {
            console.log(error);
        }
    }

    const handelCancel = () => {
        reset();
        navigate(-1);
    }

    if (isLoading) return <FullScreenLoader />;

    return (
        <div>
            {/* breadcrumb */}
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/master" className="text-primary hover:underline">
                        Master
                    </Link>
                </li>
                <li className="before:content-['/'] before:mr-2">
                    <Link to="/master/products" className="text-primary hover:underline">
                        Product
                    </Link>
                </li>
                <li className="before:content-['/'] before:mr-2">
                    <span>Add Products</span>
                </li>
            </ul>

            <div>
                {/* Grid */}
                <div className="panel mt-5" id="forms_grid">
                    <div className="">
                        <form onSubmit={handleSubmit(submit)} className="space-y-5">

                            {/* 1st row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                {/* Product Name */}
                                <div>
                                    <Input
                                        label={"Product Name"}
                                        placeholder={"Enter product name..."}
                                        {...register("name", {
                                            required: "This field is required!!!"
                                        })}
                                        error={errors.name?.message}
                                        required={true}
                                    />
                                </div>

                                {/* brand */}
                                <div className="">
                                    <Controller
                                        name="brands"
                                        control={control}
                                        rules={{
                                            required: "This field is required!!!"
                                        }}
                                        render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                            <RHSelect
                                                ref={(el) => {
                                                    ref({
                                                        focus: () => el?.focus(),
                                                    });
                                                }}
                                                value={value}
                                                onChange={onChange}

                                                label="Brand"
                                                options={brandData?.data}
                                                error={error?.message}
                                                // isMulti={true}
                                                required={true}

                                                addButton={true}
                                                buttonTitle='brand'
                                                buttonOnClick={() => setShowBrand(true)}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {/* 2nd row */}
                            <div className="grid grid-cols-1 [@media(min-width:860px)]:grid-cols-2 gap-5">

                                {/* left */}
                                <div className="grid grid-cols-1 [@media(min-width:860px)]:grid-cols-1 gap-5">

                                    {/* Barcode */}
                                    <div>
                                        <Input
                                            label={"Barcode"}
                                            placeholder={"Enter Barcode"}
                                            {...register("barcode", { required: "This field is required!!!" })}
                                            error={errors.barcode?.message}
                                            required={true}
                                            disabled={id ? true : false}
                                        />
                                    </div>

                                    {/* sku */}
                                    <div>
                                        <Input
                                            label={"SKU"}
                                            placeholder={"Enter SKU"}
                                            {...register("sku", { required: "This field is required!!!" })}
                                            error={errors.sku?.message}
                                            required={true}
                                        />
                                    </div>


                                    <div className="">
                                        {/* hsn_id */}
                                        <div className=''>
                                            <Controller
                                                name="hsn_id"
                                                control={control}
                                                rules={{
                                                    required: "This field is required!!!"
                                                }}
                                                render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                                    <RHSelect
                                                        ref={(el) => {
                                                            ref({
                                                                focus: () => el?.focus(),
                                                            });
                                                        }}
                                                        value={value}
                                                        onChange={onChange}

                                                        label="HSN Code"
                                                        selectKey='hsn_code'
                                                        options={hsnData?.data}
                                                        error={error?.message}
                                                        required={true}

                                                        addButton={true}
                                                        buttonTitle='HSN'
                                                        buttonOnClick={() => setShowHSN(true)}
                                                    />
                                                )}
                                            />
                                        </div>

                                        {/* GST Rate % */}
                                        {/* <div className='w-full flex-1'>
                                            <Input
                                                label={"GST Rate %"}
                                                placeholder={"Enter GST Rate %"}
                                                {...register("gst_rate", {
                                                    required: "This field is required!!!",
                                                    pattern: {
                                                        value: /^\d+(\.\d+)?$/,
                                                        message: "decimals allowed only",
                                                    },
                                                })}
                                                error={errors.gst_rate?.message}
                                                required={true}
                                            />
                                        </div> */}

                                        {/* Is Taxable % */}
                                        {/* <div className='flex-shrink-0'>
                                            <Controller
                                                name="is_taxable"
                                                control={control}
                                                defaultValue={true}
                                                render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                                    <RHRadioGroup
                                                        ref={(el) => {
                                                            ref({
                                                                focus: () => el?.focus(),
                                                            });
                                                        }}
                                                        value={value}
                                                        onChange={onChange}
                                                        label="Taxable"
                                                        options={[
                                                            { label: "Yes", value: true },
                                                            { label: "No", value: false },
                                                        ]}
                                                    />
                                                )}
                                            />
                                        </div> */}
                                    </div>

                                </div>

                                {/* right */}
                                <div className="grid grid-cols-1 gap-2">
                                    {/* category */}
                                    <Controller
                                        name="categories"
                                        control={control}
                                        rules={{
                                            validate: (v) =>
                                                v?.length > 0 || "Please select at least one category",
                                        }}
                                        render={({ field: { value, onChange }, fieldState }) => (
                                            <>
                                                <CategoryTree
                                                    data={categoryData}
                                                    value={value || []}
                                                    onChange={onChange}
                                                    showSelectAllbtn={false}
                                                    addButtton={true}
                                                    buttonOnClick={() => setShowCategory(true)}
                                                />

                                                {fieldState.error && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {fieldState.error.message}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>

                            </div>

                            {/* 3rd row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Package Type */}
                                <div>
                                    <Controller
                                        name="package_type_id"
                                        control={control}
                                        rules={{
                                            required: "This field is required!!!"
                                        }}
                                        render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                            <RHSelect
                                                ref={(el) => {
                                                    ref({
                                                        focus: () => el?.focus(),
                                                    });
                                                }}
                                                value={value}
                                                onChange={onChange}

                                                label="Package Type"
                                                options={packageTypeData?.data}
                                                error={error?.message}
                                                required={true}

                                                addButton={true}
                                                buttonTitle='type'
                                                buttonOnClick={() => setShowPackageType(true)}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    {/* Measure */}
                                    <div>
                                        <Input
                                            type={"number"}
                                            label={"Measure"}
                                            placeholder={"Enter Measure"}
                                            {...register("measure")}
                                        />
                                    </div>

                                    {/* Unit Type */}
                                    <div>
                                        <Controller
                                            name="unit_type_id"
                                            control={control}
                                            rules={{
                                                required: "This field is required!!!"
                                            }}
                                            render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                                <RHSelect
                                                    ref={(el) => {
                                                        ref({
                                                            focus: () => el?.focus(),
                                                        });
                                                    }}
                                                    value={value}
                                                    onChange={onChange}

                                                    label="Unit Type"
                                                    options={unitTypeData?.data}
                                                    error={error?.message}
                                                    required={true}

                                                    addButton={true}
                                                    buttonTitle='type'
                                                    buttonOnClick={() => setShowUnitType(true)}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 4th row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <Input
                                        type={"number"}
                                        label={"Minimum Stock Level"}
                                        placeholder={"Enter Reorder Level"}
                                        {...register("reorder_level")}
                                    />
                                </div>
                                <div className="grid grid-cols-1">
                                    <Controller
                                        name="image"
                                        control={control}
                                        defaultValue={null}
                                        render={({ field: { onChange } }) => (
                                            <FileUpload
                                                label="Product Image"
                                                onChange={onChange} // gets File object
                                            />
                                        )}
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <TextArea
                                        label="Description"
                                        placeholder="Enter Description"
                                        className="text-sm"
                                        rows={1}
                                        {...register("description")}
                                    />
                                </div>
                            </div>

                            {/* 6th row */}
                            <div className="flex items-center justify-end gap-14 mr-5">
                                <button
                                    className='btn btn-outline-dark'
                                    type='button'
                                    onClick={() => navigate(-1)}
                                >
                                    Cancel
                                </button>

                                <Button variant="filled" color="indigo" size="md" radius="md" type="submit" loading={createPending || updatePending} >
                                    {id ? "Update Product" : "Add Product"}
                                </Button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>

            <AddModal
                isShow={showBrand}
                setIsShow={setShowBrand}
                title="Add New Brand"
            >
                <BrandForm setIsShow={setShowBrand} />
            </AddModal>

            <AddModal
                isShow={showHSN}
                setIsShow={setShowHSN}
                title="Add New HSN"
                maxWidth={'65'}
            >
                <HSNForm setIsShow={setShowHSN} />
            </AddModal>

            <AddModal
                isShow={showCategory}
                setIsShow={setShowCategory}
                title={"Add New Category"}
                maxWidth='60'
            >
                <CategoryForm
                    setIsShow={setShowCategory}
                    data={categoryData}
                />
            </AddModal>

            <AddModal
                isShow={showUnitType}
                setIsShow={setShowUnitType}
                title="Add New Unit Type"
                maxWidth={'50'}
            >
                <UnitTypeForm setIsShow={setShowUnitType} />
            </AddModal>

            <AddModal
                isShow={showPackageType}
                setIsShow={setShowPackageType}
                title="Add New Package Type"
                maxWidth={'50'}
            >
                <PackageTypeForm setIsShow={setShowPackageType} />
            </AddModal>

        </div >
    )
}

export default AddProduct
