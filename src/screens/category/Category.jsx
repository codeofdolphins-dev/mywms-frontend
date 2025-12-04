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
import { useForm } from 'react-hook-form';
import Input from '../../components/inputs/Input';
import CreateRequsitionModal from '../../components/requisition/CreateRequsition.modal';


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

    const [active, setActive] = useState('1');
    const togglePara = (value) => {
        setActive((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    const { register } = useForm();

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
                <button
                    className="btn btn-primary"
                    onClick={() => setIsShow(true)}
                >Create Categories</button>
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
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Basic</h5>
                        </div>
                        <div className="mb-5">
                            <div className="space-y-2 font-semibold">
                                <div className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]">
                                    <button
                                        type="button"
                                        className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] ${active === '1' ? '!text-primary' : ''}`}
                                        onClick={() => togglePara('1')}
                                    >
                                        Category #1
                                        <div className={`ltr:ml-auto rtl:mr-auto ${active === '1' ? 'rotate-180' : ''}`}>
                                            <IconCaretDown />
                                        </div>
                                    </button>
                                    <div>
                                        <AnimateHeight duration={300} height={active === '1' ? 'auto' : 0}>
                                            <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">

                                                {/* checkboxes */}
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
                                        </AnimateHeight>
                                    </div>
                                </div>
                                <div className="border border-[#d3d3d3] dark:border-[#1b2e4b] rounded">
                                    <button
                                        type="button"
                                        className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] ${active === '2' ? '!text-primary' : ''}`}
                                        onClick={() => togglePara('2')}
                                    >
                                        Collapsible Group Item #2
                                        <div className={`ltr:ml-auto rtl:mr-auto ${active === '2' ? 'rotate-180' : ''}`}>
                                            <IconCaretDown />
                                        </div>
                                    </button>
                                    <div>
                                        <AnimateHeight duration={300} height={active === '2' ? 'auto' : 0}>
                                            <div className="p-4 text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <ul className="space-y-1">
                                                    <li>
                                                        <button type="button">Apple</button>
                                                    </li>
                                                    <li>
                                                        <button type="button">Orange</button>
                                                    </li>
                                                    <li>
                                                        <button type="button">Banana</button>
                                                    </li>
                                                    <li>
                                                        <button type="button">list</button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </AnimateHeight>
                                    </div>
                                </div>
                                <div className="border border-[#d3d3d3] dark:border-[#1b2e4b] rounded">
                                    <button
                                        type="button"
                                        className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] ${active === '3' ? '!text-primary' : ''}`}
                                        onClick={() => togglePara('3')}
                                    >
                                        Collapsible Group Item #3
                                        <div className={`ltr:ml-auto rtl:mr-auto ${active === '3' ? 'rotate-180' : ''}`}>
                                            <IconCaretDown />
                                        </div>
                                    </button>
                                    <div>
                                        <AnimateHeight duration={300} height={active === '3' ? 'auto' : 0}>
                                            <div className="p-4 text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <p>
                                                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard
                                                    dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla
                                                    assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur
                                                    butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus
                                                    labore sustainable VHS.
                                                </p>
                                                <button type="button" className="btn btn-primary mt-4">
                                                    Accept
                                                </button>
                                            </div>
                                        </AnimateHeight>
                                    </div>
                                </div>
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

            <CreateRequsitionModal isShow={isShow} setIsShow={setIsShow} />

        </div >
    )
}

export default Category
