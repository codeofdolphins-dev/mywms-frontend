import React, { useEffect, useState } from 'react'
import TableBody from '../../components/table/TableBody'
import { SUPER_ADMIN_BROWSE_COLUMN } from '../../utils/helper'
import ComponentHeader from '../../components/ComponentHeader'
import Card from '../../components/Card';
import { BsBuildingsFill } from 'react-icons/bs';
import superAdmin from '../../Backend/superAdmin.backend';
import TableRow from '../../components/table/TableRow';
import { utcToLocal } from '../../utils/UTCtoLocal';
import { PiEyeBold } from 'react-icons/pi';


const headerLink = [
    { title: "requisition" },
];

const cards = [
    {
        text: "Total Partners",
        number: "1500",
        icon: BsBuildingsFill,
        iconColor: "text-blue-500",
        iconBgColor: "bg-blue-100"
    },
    {
        text: "Approaved Partners",
        number: "1300",
        icon: BsBuildingsFill,
        iconColor: "text-blue-500",
        iconBgColor: "bg-blue-100"
    },
    // {
    //     text: "Pendings",
    //     number: "100",
    //     icon: BsBuildingsFill,
    //     iconColor: "text-blue-500",
    //     iconBgColor: "bg-blue-100"
    // },
    // {
    //     text: "Rejected",
    //     number: "100",
    //     icon: BsBuildingsFill,
    //     iconColor: "text-blue-500",
    //     iconBgColor: "bg-blue-100"
    // }
]

const SuperAdmin = () => {
    const [showPassword, setShowPassword] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);




    const { data: companyList, isLoading: companyListLoading } = superAdmin.TQCompanyList();
    const isEmpty = false

    // console.log(companyList);

    function handelShowPassword(id) {
        if (showPassword === null)
            setShowPassword(id);
        else
            setShowPassword(null);
    }

    useEffect(() => {
        if (!showPassword) return;

        setTimeout(() => {
            handelShowPassword();
        }, 5000);

    }, [showPassword])


    return (
        <div>
            {/* <ComponentHeader
        headerLink={headerLink}
      /> */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
                {
                    cards?.map((card, idx) =>
                        <Card
                            key={idx}
                            header={card.text}
                            number={card.number}
                            Icon={card.icon}
                            IconColor={card.iconColor}
                            IconBgColor={card.iconBgColor}
                        />
                    )
                }
            </div>

            <div className="panel mt-5">
                <TableBody
                    columns={SUPER_ADMIN_BROWSE_COLUMN}
                    isEmpty={isEmpty}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    limit={limit}
                    setLimit={setLimit}
                    totalPage={companyList?.meta?.totalPages}
                >
                    {
                        companyList?.data?.map((record) =>
                            <TableRow
                                key={record.id}
                                columns={SUPER_ADMIN_BROWSE_COLUMN}
                                row={{
                                    name: record.companyName,
                                    email: record.email,
                                    password: (
                                        <div className="flex items-start gap-2 max-w-xs pr-4">
                                            <span className="break-all flex-1">
                                                {showPassword === record.id
                                                    ? record.password
                                                    : "XXXXXXXX"}
                                            </span>

                                            <button
                                                onClick={() => handelShowPassword(record.id)}
                                                className="shrink-0 cursor-pointer mt-1"
                                            >
                                                <PiEyeBold size={18} />
                                            </button>
                                        </div>

                                    ),
                                    phone: record.phone,
                                    joiningDate: utcToLocal(record.createdAt),
                                    status: (
                                        <div className={`badge rounded-full text-center ${record.status ? "badge-outline-success" : "badge-outline-danger"}`}>
                                            {record.status ? "Active" : "Inactive"}
                                        </div>
                                    ),
                                    action: (<>
                                    </>),
                                }}
                            />
                        )
                    }

                </TableBody>
            </div>
        </div>
    )
}

export default SuperAdmin