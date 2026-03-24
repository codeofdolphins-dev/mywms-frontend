import React from 'react';
import IconPencilPaper from '../../Icon/IconPencilPaper';
import IconCoffee from '../../Icon/IconCoffee';
import { Link, useParams } from 'react-router-dom';
import IconMapPin from '../../Icon/IconMapPin';
import IconMail from '../../Icon/IconMail';
import IconPhone from '../../Icon/IconPhone';
import ImageComponent from '../../ImageComponent';
import { FaUserTie } from "react-icons/fa";

const ProfileCard = ({
    data,
    image,
    onCreate = false,
    onEdit = false,
    oldPreview = ""
}) => {
    const { id } = useParams();
    return (
        <div className="panel">
            <div className="flex items-center justify-between mb-5">
                <h5 className="font-semibold text-lg ">{onCreate ? "Profile Preview" : "Profile"}</h5>
                {
                    !onCreate &&
                    <Link to={`/user/update/${id}`} className="ml-auto btn btn-primary p-2 rounded-full">
                        <IconPencilPaper />
                    </Link>
                }
            </div>

            <div className={`mb-5 mx-0 xl:mx-20 ${onCreate ? "flex flex-row-reverse items-center justify-evenly" : ""}`}>

                <div className={`flex justify-center items-center ${onCreate ? "flex-row-reverse w-1/2" : "flex-col"}`}>
                    {
                        onCreate ?
                            image
                                ? <img
                                    src={image}
                                    alt="Preview"
                                    className="w-full h-72 object-cover rounded-md border"
                                />
                                : oldPreview
                                    ? <ImageComponent
                                        className={"w-full h-72 object-top rounded-md"}
                                        dummyImage={2}
                                        src={oldPreview}
                                    />
                                    : <FaUserTie className='w-full h-40 text-gray-400' />
                            : <>
                                <ImageComponent
                                    className={"w-24 h-24"}
                                    dummyImage={2}
                                    src={data?.profile_image}
                                />
                            </>
                    }
                </div>

                <ul
                    className={`mt-5 flex flex-col max-w-[200px] space-y-4 font-semibold text-white-dark ${onCreate ? "w-1/2 self-start" : "m-auto"}`}
                >
                    <p
                        className={`font-semibold text-primary text-xl ${onCreate ? "truncate" : "text-center"}`}
                    >
                        {data?.name?.full_name || data?.full_name}
                    </p>

                    <li className="w-full flex items-center justify-start gap-2">
                        {onCreate
                            ? <p className={onCreate ? "w-1/3" : ""}>Email: </p>
                            : <IconMail className="w-5 h-5 shrink-0" />}
                        <span className={`text-primary truncate ${onCreate ? "w-2/3" : ""}`} dir='ltr'>
                            {data?.email}
                        </span>
                    </li>

                    <li className=" w-full flex items-center justify-start gap-2">
                        {onCreate
                            ? <p className={onCreate ? "w-1/3" : ""}>Number: </p>
                            : <IconPhone />}
                        <span className={`whitespace-nowrap truncate ${onCreate ? "w-2/3" : ""}`} dir="ltr">
                            {data?.phone_no}
                        </span>
                    </li>

                    {
                        (onCreate && onEdit) && <>
                            <li className=" w-full flex items-center justify-start gap-2">
                                <p className={onCreate ? "w-1/3" : ""}>Location: </p>
                                <span className={`whitespace-nowrap ${onCreate ? "w-2/3 truncate" : ""}`} dir="ltr">
                                    {data?.location}
                                </span>
                            </li>
                            {data?.isNodeAdmin !== null &&
                                <li className=" w-full flex items-center justify-start gap-2">
                                    <p className={onCreate ? "w-1/3" : ""}>Role: </p>
                                    <span className={`whitespace-nowrap ${onCreate ? "w-2/3" : ""}`}>
                                        {data?.isNodeAdmin === "true" ? "Location Admin" : "Location User"}
                                    </span>
                                </li>
                            }
                            {data?.dept !== null &&
                                <li className=" w-full flex items-center justify-start gap-2">
                                    <p>Department: </p>
                                    <span className={`whitespace-nowrap ${onCreate ? "w-2/3" : ""}`}>
                                        {data?.dept}
                                    </span>
                                </li>
                            }
                        </>
                    }
                </ul>
            </div>
        </div>
    )
}

export default ProfileCard