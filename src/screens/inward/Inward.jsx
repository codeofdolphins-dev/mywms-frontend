import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchInput from '../../components/inputs/SearchInput'
import IconSettings from '../../components/Icon/IconSettings';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import AnimateHeight from 'react-animate-height';
import IconCode from '../../components/Icon/IconCode';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import Tippy from '@tippyjs/react';
import Input from '../../components/inputs/Input';
import ButtonBoolean from '../../components/inputs/ButtonBoolean';
import ItemTable from '../../components/ItemTable';
import AddModal from '../../components/Add.modal';
import Form from '../../components/brand/Form';
import { FiPlus } from 'react-icons/fi';
import ComponentHeader from '../../components/ComponentHeader';
import { useForm } from 'react-hook-form';


const tableData = [
    {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@yahoo.com',
        date: '10/08/2020',
        sale: 120,
    },
    {
        id: 2,
        name: 'Shaun Park',
        email: 'shaunpark@gmail.com',
        date: '11/08/2020',
        sale: 400,
    },
    {
        id: 3,
        name: 'Alma Clarke',
        email: 'alma@gmail.com',
        date: '12/02/2020',
        sale: 310,
    },
    {
        id: 4,
        name: 'Vincent Carpenter',
        email: 'vincent@gmail.com',
        date: '13/08/2020',
        sale: 100,
    },
];

const headerLink = [
    { title: "inward" }
];

const Inward = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [isShow, setIsShow] = useState(false);
    const colName = ["id", "name", "email", "date", "sale", "Actions"];

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            poNumber: ""
        }
    });

    useEffect(() => {
        reset();
    }, [isShow]);

    const onSubmit = async (data) => {
        console.log(data);
        navigate(`/inward/create?s=${data?.poNumber}`);
        setIsShow(false);
    }

    return (
        <div>

            <ComponentHeader
                headerLink={headerLink}
                searchPlaceholder='search by PO number'
                setDebounceSearch={setSearch}
                btnTitle='Inward'
                btnOnClick={() => setIsShow(true)}
            />

            <div className="mt-5" />

            {/* Item table */}
            <ItemTable
                columns={colName}
                items={tableData}
                edit={true}
                isLoading={false}
            />

            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title="Add Inward"
                maxWidth='50'
                placement='start'
            >
                <div className="panel">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 gap-4">
                            <Input
                                label="PO Number"
                                labelPosition="inline"
                                type="text"
                                placeholder="Enter PO Number"
                                {...register("poNumber")}
                            />
                        </div>

                        <div className="my-5 flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs font-medium text-gray-400 border border-gray-200 rounded-full px-3 py-0.5 tracking-wider">
                                OR
                            </span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        {/* buttons section */}
                        <div className="flex items-center justify-end gap-2 mt-5">
                            <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => setIsShow(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </AddModal>

        </div >
    )
}

export default Inward