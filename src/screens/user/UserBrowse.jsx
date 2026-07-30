import React, { useEffect, useState } from 'react'
import masterData from '@/Backend/master.backend';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaWarehouse, FaIndustry, FaHandshake, FaBuilding, FaLayerGroup } from 'react-icons/fa';
import { LiaSpinnerSolid } from "react-icons/lia";
import TableRow from '@/components/table/TableRow';
import CustomeButton from "@/components/inputs/Button"
import IconPencil from '@/components/Icon/IconPencil';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import ImageComponent from '@/components/ImageComponent';
import Breadcrumb from '../../components/Breadcrumb';
import ComponentHeader from '../../components/ComponentHeader';
import TableBody from '../../components/table/TableBody';
import { USER_LIST_COLUMN } from '../../utils/helper';
import { confirmation } from '../../utils/alerts';
import fetchData from '../../Backend/fetchData.backend';
import business from '../../Backend/business.fetch';


// rotating color themes for the dynamic cards
const CARD_THEMES = [
    { bgColor: "bg-blue-50", activeBorder: "border-blue-600", textColor: "text-blue-600" },
    { bgColor: "bg-amber-50", activeBorder: "border-amber-600", textColor: "text-amber-600" },
    { bgColor: "bg-emerald-50", activeBorder: "border-emerald-600", textColor: "text-emerald-600" },
    { bgColor: "bg-violet-50", activeBorder: "border-violet-600", textColor: "text-violet-600" },
    { bgColor: "bg-rose-50", activeBorder: "border-rose-600", textColor: "text-rose-600" },
    { bgColor: "bg-cyan-50", activeBorder: "border-cyan-600", textColor: "text-cyan-600" },
];

const CATEGORY_ICONS = {
    manufacturing: <FaIndustry />,
    warehouse: <FaWarehouse />,
    partner: <FaHandshake />,
};


const UserBrowse = () => {
    const navigate = useNavigate();

    const { mutateAsync: deleteData, isPending: deletePending } = masterData.TQDeleteMaster(["allUserList", "userCountByNode"]);

    /**************** place cards *******************/
    const { data: registeredNodeList, isLoading: nodesLoading } = business.TQTenantRegisteredNodeList({ isAllowOwner: true, noLimit: true });
    const { data: userCount, isLoading: userCountLoading } = fetchData.TQUserCountByNode();
    const countData = userCount?.data || [];

    const getCount = (nodeId) => {
        const item = countData.find(d => d.node_id === nodeId);
        return item ? parseInt(item.count) : 0;
    };

    // total across every place, shown on the "All Users" card
    const totalCount = countData.reduce((sum, d) => sum + (parseInt(d.count) || 0), 0);

    const placeCards = (registeredNodeList?.data || []).map((item, index) => ({
        id: item?.businessNode?.id,
        name: item?.name,
        // owner node has no type, everything else is labelled by its node type
        typeName: item?.businessNode?.type?.name || "Head Office",
        category: item?.businessNode?.type?.category,
        icon: CATEGORY_ICONS[item?.businessNode?.type?.category] || <FaBuilding />,
        count: getCount(item?.businessNode?.id),
        node: item,
        ...CARD_THEMES[index % CARD_THEMES.length],
    }));

    /**************** pagination variables *******************/
    const [activeNodeId, setActiveNodeId] = useState(null);
    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);


    /**************** data fetching GET *******************/
    const params = {
        ...(debounceSearch && { text: debounceSearch }),
        ...(activeNodeId && { node_id: activeNodeId }),
        page: currentPage || null,
        limit: limit || null
    };
    const { data: userList, isLoading } = fetchData.TQAllUserList(params);
    const isEmpty = userList?.data?.length === 0;

    useEffect(() => {
        setCurrentPage(1);
    }, [debounceSearch, activeNodeId]);


    function handleEdit(id) {
        navigate(`/admin/user/update/${id}`)
    };

    /** register user with the place preselected */
    function registerUser(node) {
        navigate("/admin/user/register", { state: node });
    }

    async function handleDelete(email) {
        try {
            const isConfirm = await confirmation();

            if (isConfirm) {
                await deleteData({ path: `auth/delete/${email}` });
            }

        } catch (error) {
            console.log(error)
        }
    };


    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
            <Breadcrumb
                options={[{ title: "user" }]}
                className='mb-1'
            />

            {/* 1. Top Place Cards with Add Icon */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-4">
                {/* default card — clears the place filter and lists every user */}
                <div
                    onClick={() => setActiveNodeId(null)}
                    className={`group rounded-2xl border-2 p-4 hover:shadow-md transition-all relative flex gap-4 items-center cursor-pointer bg-slate-50 ${!activeNodeId ? "border-slate-700 shadow-md" : "border-gray-200 shadow-sm"}
                    `}
                >
                    <div className="shrink-0 p-3 sm:p-4 rounded-xl bg-white text-slate-700 text-xl sm:text-2xl">
                        <FaLayerGroup />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-gray-800 leading-snug truncate">All Users</h3>
                        <div className="flex items-center gap-2 mt-1 min-w-0">
                            <span className="shrink-0 text-xs font-bold text-gray-400 uppercase tracking-wider">ALL</span>
                            <span className="shrink-0 w-1 h-1 bg-gray-300 rounded-full"></span>
                            {
                                userCountLoading ? (
                                    <LiaSpinnerSolid size={15} className='shrink-0 animate-spin text-blue-400' />
                                ) : (
                                    <span className="shrink-0 text-sm text-blue-600 whitespace-nowrap">{totalCount} User(s)</span>
                                )
                            }
                        </div>
                    </div>
                </div>

                {nodesLoading ? (
                    [...Array(4)].map((_, index) => (
                        <div key={index} className="rounded-2xl border-2 border-gray-200 bg-white p-4 h-24 animate-pulse shadow-sm" />
                    ))
                ) : (
                    placeCards.map((cat) => (
                        <div
                            key={cat.id}
                            onClick={() => setActiveNodeId(prev => prev === cat.id ? null : cat.id)}
                            className={`group rounded-2xl border-2 p-4 hover:shadow-md transition-all relative flex gap-4 items-center cursor-pointer ${cat.bgColor} ${activeNodeId === cat.id ? `${cat.activeBorder} shadow-md` : "border-gray-200 shadow-sm"}
                            `}
                        >

                            <div className={`shrink-0 p-3 sm:p-4 rounded-xl bg-white ${cat.textColor} text-xl sm:text-2xl`}>
                                {cat.icon}
                            </div>

                            <div className="min-w-0 flex-1 flex justify-between items-start gap-2">
                                <div className="min-w-0">
                                    <h3 className="text-base font-bold text-gray-800 leading-snug truncate" title={cat.name}>{cat.name}</h3>
                                    <div className="flex items-center gap-2 mt-1 min-w-0">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider truncate" title={cat.typeName}>{cat.typeName}</span>
                                        <span className="shrink-0 w-1 h-1 bg-gray-300 rounded-full"></span>
                                        {
                                            userCountLoading ? (
                                                <LiaSpinnerSolid size={15} className='shrink-0 animate-spin text-blue-400' />
                                            ) : (
                                                <span className="shrink-0 text-sm text-blue-600 whitespace-nowrap">{cat.count} User(s)</span>
                                            )
                                        }
                                    </div>
                                </div>

                                {/* The "Add" Icon for each place */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        registerUser(cat.node);
                                    }}
                                    className="shrink-0 bg-gray-50 text-gray-400 p-2 rounded-full hover:bg-[#0052CC] hover:text-white transition-all shadow-sm"
                                >
                                    <FaPlus size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>


            <div className="panel">
                <ComponentHeader
                    addButton={false}
                    searchPlaceholder='Search by name, email, phone...'
                    searchClassName='z-5'
                    setDebounceSearch={setDebounceSearch}
                />

                {/* table */}
                <div className="z-0 min-h-64 mt-5">
                    <TableBody
                        columns={USER_LIST_COLUMN}
                        isEmpty={isEmpty}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        limit={limit}
                        setLimit={setLimit}
                        totalPage={userList?.meta?.totalPages}
                        isLoading={isLoading || deletePending}
                    >
                        {userList?.data?.map((item) =>
                            <TableRow
                                key={item.id}
                                columns={USER_LIST_COLUMN}
                                onClick={() => navigate(`/admin/user/profile/${item.id}`)}
                                row={{
                                    logo: (
                                        <ImageComponent
                                            src={item?.profile_image}
                                            className={"w-12 h-12 object-top"}
                                        />
                                    ),
                                    name: item?.name?.full_name,
                                    email: item?.email,
                                    phone: item?.phone_no,
                                    active: item?.is_active ? "Active" : "Inactive",
                                    action: (
                                        <div className="flex space-x-3">
                                            <CustomeButton
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleEdit(item.id)
                                                }}
                                            >
                                                <IconPencil className="text-success hover:scale-110 cursor-pointer" />
                                            </CustomeButton>

                                            <CustomeButton onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(item.email)
                                            }}>
                                                <IconTrashLines className="text-danger hover:scale-110 cursor-pointer" />
                                            </CustomeButton>
                                        </div>
                                    )
                                }}
                            />
                        )}
                    </TableBody>
                </div>
            </div>
        </div>
    )
}

export default UserBrowse
