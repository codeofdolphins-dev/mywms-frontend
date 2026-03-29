import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { useState, Fragment } from "react";
import IconX from "./Icon/IconX";
import { Button } from "@mantine/core";
import { useForm } from "react-hook-form";
import TextArea from "./inputs/TextArea";

const AddModal = ({
    isShow,
    setIsShow,
    title,
    maxWidth = "75",
    blur = true,
    dark = false,
    placement = "center",
    children
}) => {
    return (
        <div>
            <Transition appear show={isShow} as={Fragment}>
                <Dialog as="div" open={isShow} onClose={() => setIsShow(false)}>
                    <div className={`fixed inset-0 z-[999] overflow-y-auto ${blur ? "bg-[black]/60" : ""} ${dark ? "bg-[black]" : ""} `}>
                        <div className={`flex min-h-screen items-${placement} justify-center px-4`}>
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel
                                    as="div"
                                    className={`panel my-8 w-full overflow-hidden rounded-lg border-0 p-0 text-black max-w-[90%] md:max-w-[80%] lg:max-w-[60%] xl:max-w-[${maxWidth}%]`}
                                >
                                    <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 relative z-10 shadow-lg">
                                        <h5 className="text-lg font-bold">{title}</h5>
                                        <button
                                            type="button"
                                            className="text-white-dark hover:text-dark"
                                            onClick={() => {
                                                setIsShow(false);
                                            }}
                                        >
                                            <IconX />
                                        </button>
                                    </div>
                                    {children}
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default AddModal;
