import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AdminInventory from './components/adminInventory';
import NonAdminInventory from './components/NonAdminInventory';




const Inventory = () => {

    const roles = useSelector(state => state.auth.roles);

    if (["system", "owner", "company", "admin"].some(r => roles.includes(r))) {
        return <AdminInventory />
    }

    return <NonAdminInventory />
};

export default Inventory;
