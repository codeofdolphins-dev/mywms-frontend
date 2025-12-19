import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SearchInput from '../../components/inputs/SearchInput'
import IconSettings from '../../components/Icon/IconSettings';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import AnimateHeight from 'react-animate-height';
import IconCode from '../../components/Icon/IconCode';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import Tippy from '@tippyjs/react';
import Input from '../../components/inputs/Input';
import ButtonBasic from '../../components/inputs/ButtonBasic';
import { FaPlus } from "react-icons/fa6";
import CreateCategoryModal from '../../components/category/CreateCategory.modal';
import AddModal from '../../components/Add.modal';
import CategoryForm from '../../components/category/CategoryForm';
import fetchData from '../../Backend/fetchData';
import FullScreenLoader from '../../components/FullScreenLoader';
import { utcToLocal } from '../../utils/UTCtoLocal';


const tableData = [
    {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@yahoo.com',
        date: '10/08/2020',
        sale: 120,
        status: 'Complete',
        register: '5 min ago',
        progress: '40%',
        position: 'Developer',
        office: 'London',
    },
    {
        id: 2,
        name: 'Shaun Park',
        email: 'shaunpark@gmail.com',
        date: '11/08/2020',
        sale: 400,
        status: 'Pending',
        register: '11 min ago',
        progress: '23%',
        position: 'Designer',
        office: 'New York',
    },
    {
        id: 3,
        name: 'Alma Clarke',
        email: 'alma@gmail.com',
        date: '12/02/2020',
        sale: 310,
        status: 'In Progress',
        register: '1 hour ago',
        progress: '80%',
        position: 'Accountant',
        office: 'Amazon',
    },
    {
        id: 4,
        name: 'Vincent Carpenter',
        email: 'vincent@gmail.com',
        date: '13/08/2020',
        sale: 100,
        status: 'Canceled',
        register: '1 day ago',
        progress: '60%',
        position: 'Data Scientist',
        office: 'Canada',
    },
];


const Category = () => {

    const [search, setSearch] = useState('');
    const [isShow, setIsShow] = useState(false);

    const { data, isLoading } = fetchData.TQAllCategoryList();


    const [active, setActive] = useState('1');
    const togglePara = (value) => {
        setActive((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };


    function handelEdit(id) {
        console.log(id);
    }

    function handelDelete(id) {
        console.log(id);
    }


    if (isLoading) return <FullScreenLoader />

    return (
        <div>
            {/* breadcrumb */}
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/master" className="text-primary hover:underline">
                        Master
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Category</span>
                </li>
            </ul>

            {/* Header Section */}
            <div className="flex justify-between items-center mt-5">
                <div>
                    <h1 className="text-5xl font-bold my-3">Categories</h1>
                    <p className='text-gray-600 text-base'>Manage and view all categories</p>
                </div>
                <ButtonBasic
                    setState={setIsShow}
                >
                    Add Categories
                </ButtonBasic>
            </div>


            {/* Search and Add Button */}
            <div className="flex flex-col sm:flex-row gap-4 my-6">
                <SearchInput
                    type="text"
                    placeholder="Search by name or description..."
                    className="bg- border-pink-500"
                    value={search}
                    setValue={setSearch}
                />
            </div>

            {/* collapsable table */}
            {search === '' ?
                (
                    <div className="panel" id="basic">
                        {/* <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Category List</h5>
                        </div> */}
                        <div className="mb-5">
                            <div className="space-y-2 font-semibold">
                                <table>
                                    <thead>
                                        <tr className='flex !w-full justify-between items-center pr-5'>
                                            <th>Name</th>
                                            <th>Desc</th>
                                            <th>Status</th>
                                            <th>CreatedAt</th>
                                            <th >Action</th>
                                        </tr>
                                    </thead>
                                </table>
                                {
                                    data.map((item, i) => {

                                        return <div key={i} className="border border-[#d3d3d3] rounded">
                                            <button
                                                type="button"
                                                className={`p-4 w-full flex items-center text-white-dark ${active === `${i + 1}` ? '!text-primary' : ''}`}
                                                onClick={() => togglePara(`${i + 1}`)}
                                            >
                                                <tr className='flex !w-full justify-between items-center mr-2' >
                                                    <td>
                                                        <div className="whitespace-nowrap">{item.name}</div>
                                                    </td>
                                                    <td>{item.description}</td>
                                                    <td>{String(item.status)}</td>
                                                    <td>{utcToLocal(item.createdAt)}</td>
                                                    <td className="text-center">
                                                        <ul className="flex items-center justify-center gap-2">
                                                            <li>
                                                                <Tippy content="Edit">
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handelEdit(item.id)
                                                                        }}
                                                                        className='hover:scale-125'
                                                                    >
                                                                        <IconPencil className="text-success" />
                                                                    </button>
                                                                </Tippy>
                                                            </li>
                                                            <li>
                                                                <Tippy content="Delete">
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handelDelete(item.id)
                                                                        }}
                                                                        className='hover:scale-125'
                                                                    >
                                                                        <IconTrashLines className="text-danger" />
                                                                    </button>
                                                                </Tippy>
                                                            </li>
                                                        </ul>
                                                    </td>
                                                </tr>
                                                <div className={`ml-auto ${active === `${i + 1}` ? 'rotate-180' : ''}`}>
                                                    <IconCaretDown />
                                                </div>
                                            </button>
                                            {
                                                item.subcategories.length > 0
                                                    ? <div>
                                                        <AnimateHeight duration={300} height={active === '1' ? 'auto' : 0}>
                                                            <div className="space-y-2 py-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">

                                                                {/* checkboxes */}
                                                                <div className="table-responsive mb-5">
                                                                    <table>
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Name</th>
                                                                                <th>Desc</th>
                                                                                <th>Status</th>
                                                                                <th>CreatedAt</th>
                                                                                <th className="!text-center">Action</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {item?.subcategories?.map((data) => {
                                                                                return (
                                                                                    <tr
                                                                                        key={data.id}
                                                                                    >
                                                                                        <td>
                                                                                            <div className="whitespace-nowrap">{data.name}</div>
                                                                                        </td>
                                                                                        <td>{data.description}</td>
                                                                                        <td>{String(data.status)}</td>
                                                                                        <td>{utcToLocal(data.createdAt)}</td>
                                                                                        <td className="text-center">
                                                                                            <ul className="flex items-center justify-center gap-2">
                                                                                                <li>
                                                                                                    <Tippy content="Edit">
                                                                                                        <button
                                                                                                            type="button"
                                                                                                            onClick={() => handelEdit(data.id)}
                                                                                                        >
                                                                                                            <IconPencil className="text-success" />
                                                                                                        </button>
                                                                                                    </Tippy>
                                                                                                </li>
                                                                                                <li>
                                                                                                    <Tippy content="Delete">
                                                                                                        <button
                                                                                                            type="button"
                                                                                                            onClick={() => handelDelete(data.id)}
                                                                                                        >
                                                                                                            <IconTrashLines className="text-danger" />
                                                                                                        </button>
                                                                                                    </Tippy>
                                                                                                </li>
                                                                                            </ul>
                                                                                        </td>
                                                                                    </tr>
                                                                                );
                                                                            })}
                                                                        </tbody>
                                                                    </table>
                                                                </div>

                                                            </div>
                                                        </AnimateHeight>
                                                    </div>
                                                    : null
                                            }
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                ) : (
                    < div className="panel">
                        <div className="table-responsive mb-5">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Date</th>
                                        <th>Sale</th>
                                        <th className="!text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((data) => {
                                        return (
                                            <tr key={data.id}>
                                                <td>
                                                    <div className="whitespace-nowrap">{data.name}</div>
                                                </td>
                                                <td>{data.date}</td>
                                                <td>{data.sale}</td>
                                                <td className="text-center">
                                                    <ul className="flex items-center justify-center gap-2">
                                                        <li>
                                                            <Tippy content="Edit">
                                                                <button type="button">
                                                                    <IconPencil className="text-success" />
                                                                </button>
                                                            </Tippy>
                                                        </li>
                                                        <li>
                                                            <Tippy content="Delete">
                                                                <button type="button">
                                                                    <IconTrashLines className="text-danger" />
                                                                </button>
                                                            </Tippy>
                                                        </li>
                                                    </ul>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }

            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title={"Add New Category"}
                maxWidth='60'
            >
                <CategoryForm
                    setIsShow={setIsShow}
                    data={data}
                />
            </AddModal>

        </div >
    )
}

export default Category
