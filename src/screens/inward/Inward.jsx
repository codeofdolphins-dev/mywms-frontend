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
import ButtonBoolean from '../../components/inputs/ButtonBoolean';
import ItemTable from '../../components/ItemTable';
import AddModal from '../../components/Add.modal';
import Form from '../../components/brand/Form';
import { FiPlus } from 'react-icons/fi';


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


const Inward = () => {

  const [search, setSearch] = useState('');
  const [isShow, setIsShow] = useState(false);
  const [items, setItems] = useState(tableData);
  const colName = ["Id", "Logo", "Brand Name", "Status", "CreatedAt", "Actions"];

  return (
    <div>
      {/* breadcrumb */}
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li className="">
          <span>Inward</span>
        </li>
      </ul>

      {/* Header Section */}
      <div className="flex justify-between items-center mt-5">
        <div>
          <h1 className="text-5xl font-bold my-3">Inward</h1>
          <p className='text-gray-600 text-base'>Manage and view all inwards</p>
        </div>
        <ButtonBoolean
          setState={setIsShow}
        >
          <FiPlus size={20} className='mr-2'/>
          Add New Inward
        </ButtonBoolean>
      </div>


      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 my-6">
        <SearchInput
          type="text"
          placeholder="Search by purchase order id"
          className="bg- border-pink-500"
          value={search}
          setValue={setSearch}
        />
      </div>

      {/* Item table */}
      <ItemTable
        colName={colName}
        items={items}
        setItems={setItems}
        upperCase={true}
        edit={true}
      />


      <AddModal
        isShow={isShow}
        setIsShow={setIsShow}
        title="Add New Brand"
      >
        <Form />
      </AddModal>

    </div >
  )
}

export default Inward