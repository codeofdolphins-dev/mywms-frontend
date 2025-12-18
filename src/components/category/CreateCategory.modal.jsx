import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { useState, Fragment } from 'react';
import IconX from '../Icon/IconX';
import { Button } from '@mantine/core';
import { useForm } from "react-hook-form"
import Input from '../inputs/Input';
import TextArea from '../inputs/TextArea';

const CreateCategoryModal = ({ isShow, setIsShow }) => {

    const [isSubmit, setIsSubmit] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
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
                                <DialogPanel as="div" className="panel my-8 w-full max-w-3xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold">Add New Category</h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => {
                                            setIsShow(false);
                                            reset();
                                        }}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <form className="p-5" onSubmit={handleSubmit(submitForm)}>
                                        <div className="flex flex-col gap-3">
                                            <Input
                                                type={"text"}
                                                label={"Category"}
                                                placeholder={"Enter category"}
                                                {...register("category", { required: true })}
                                                error={errors.category?.message === ''}
                                            />
                                            <Input
                                                type={"text"}
                                                label={"Sub Category"}
                                                placeholder={"Enter Sub-Category (optional)"}
                                                {...register("subCategory")}
                                            />
                                            <TextArea
                                                label={"Description"}
                                                placeholder="Enter desc (optional)"
                                                {...register("description")}
                                            />
                                        </div>
                                        <div className="mt-8 flex items-center justify-end gap-4">
                                            <Button variant="filled" color="indigo" size="md" radius="md" type="submit" loading={isSubmit}>Create Category</Button>
                                        </div>
                                    </form>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}

export default CreateCategoryModal;