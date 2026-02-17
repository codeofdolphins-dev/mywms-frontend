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
import ComponentHeader from '../../components/ComponentHeader';


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
  {
    title: "inward"
  }
];

const Inward = () => {

  const [search, setSearch] = useState('');
  const colName = ["id", "name", "email", "date", "sale", "Actions"];

  return (
    <div>

      <ComponentHeader
        headerLink={headerLink}
        searchPlaceholder='search by PO number'
        setDebounceSearch={setSearch}
        btnTitle='add GRN record'
      />

      <div className="mt-5" />

      {/* Item table */}
      <ItemTable
        columns={colName}
        items={tableData}
        edit={true}
        // isLoading={false}
      />

    </div >
  )
}

export default Inward