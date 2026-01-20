import React from 'react'
import IconPencilPaper from '../../Icon/IconPencilPaper'
import IconCoffee from '../../Icon/IconCoffee'
import { Link } from 'react-router-dom'
import IconMapPin from '../../Icon/IconMapPin'
import IconMail from '../../Icon/IconMail'
import IconPhone from '../../Icon/IconPhone'

const ProfileCard = () => {
    return (
        <div className="panel">
            <div className="flex items-center justify-between mb-5">
                <h5 className="font-semibold text-lg dark:text-white-light">Profile</h5>
                <Link to="/users/user-account-settings" className="ltr:ml-auto rtl:mr-auto btn btn-primary p-2 rounded-full">
                    <IconPencilPaper />
                </Link>
            </div>
            <div className="mb-5">
                <div className="flex flex-col justify-center items-center">
                    <img src="/assets/images/profile-34.jpeg" alt="img" className="w-24 h-24 rounded-full object-cover  mb-5" />
                    <p className="font-semibold text-primary text-xl">Jimmy Turner</p>
                </div>
                <ul className="mt-5 flex flex-col max-w-[160px] m-auto space-y-4 font-semibold text-white-dark">
                    <li className="flex items-center gap-2">
                        <IconCoffee className="shrink-0" />
                        Web Developer
                    </li>
                    <li className="flex items-center gap-2">
                        <IconMapPin className="shrink-0" />
                        New York, USA
                    </li>
                    <li>
                        <button className="flex items-center gap-2">
                            <IconMail className="w-5 h-5 shrink-0" />
                            <span className="text-primary truncate">jimmy@gmail.com</span>
                        </button>
                    </li>
                    <li className="flex items-center gap-2">
                        <IconPhone />
                        <span className="whitespace-nowrap" dir="ltr">
                            +1 (530) 555-12121
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default ProfileCard