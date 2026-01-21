import React from 'react'
import IconPencilPaper from '../../Icon/IconPencilPaper'
import IconCoffee from '../../Icon/IconCoffee'
import { Link } from 'react-router-dom'
import IconMapPin from '../../Icon/IconMapPin'
import IconMail from '../../Icon/IconMail'
import IconPhone from '../../Icon/IconPhone'
import ImageComponent from '../../ImageComponent'

const ProfileCard = ({
    data,
    isEdit = true,
    onCreate = true,
}) => {
    return (
        <div className="panel">
            <div className="flex items-center justify-between mb-5">
                <h5 className="font-semibold text-lg dark:text-white-light">Profile</h5>
                {
                    isEdit &&
                    <Link to="/users/user-account-settings" className="ltr:ml-auto rtl:mr-auto btn btn-primary p-2 rounded-full">
                        <IconPencilPaper />
                    </Link>
                }
            </div>

            <div className="mb-5">
                <div className={`flex justify-center items-center ${onCreate ? "flex-row-reverse" : "flex-col"}`}>
                    <ImageComponent
                        className={"w-24 h-24"}
                    />
                    <p className="font-semibold text-primary text-xl">{data?.name?.full_name}</p>
                </div>
                <ul className="mt-5 flex flex-col max-w-[200px] m-auto space-y-4 font-semibold text-white-dark">
                    {/* <li className="flex items-center gap-2">
                        <IconCoffee className="shrink-0" />
                        Web Developer
                    </li> */}
                    <li>
                        <button className="flex items-center gap-2">
                            <IconMail className="w-5 h-5 shrink-0" />
                            <span className="text-primary truncate">{data?.email}</span>
                        </button>
                    </li>
                    <li className="flex items-center gap-2">
                        <IconPhone />
                        <span className="whitespace-nowrap" dir="ltr">
                            {data?.phone_no}
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default ProfileCard