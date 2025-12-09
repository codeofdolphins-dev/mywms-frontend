import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { useState, Fragment } from 'react';
import IconX from '../Icon/IconX';
import { Button } from '@mantine/core';
import { useForm } from "react-hook-form"
import Input from '../inputs/Input';
import TextArea from '../inputs/TextArea';
import Form from './Form';

const AddBrandModal = ({ isShow, setIsShow }) => {

    const [isSubmit, setIsSubmit] = useState(false);

    const {
        reset
    } = useForm();

    const submitForm = (data) => {
        setIsSubmit(true);

        setTimeout(() => {
            setIsSubmit(false);
            setIsShow(false);
            reset();
        }, 1000);
    }


    return (
        <div>
            <Transition appear show={isShow} as={Fragment}>
                <Dialog as="div" open={isShow} onClose={() => {
                    setIsShow(false);
                    reset();
                }}>
                    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-center justify-center px-4">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel as="div" className="panel my-8 w-full h-full overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold">Add New Brand</h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => {
                                            setIsShow(false);
                                            reset();
                                        }}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <Form />
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}

export default AddBrandModal;
