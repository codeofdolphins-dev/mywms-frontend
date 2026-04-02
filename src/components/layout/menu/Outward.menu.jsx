import React from 'react'
import { BsBoxArrowUp } from 'react-icons/bs'
import IconCaretDown from '../../Icon/IconCaretDown'
import { NavLink, useNavigate } from 'react-router-dom'


const Outward = () => {
    const navigate = useNavigate();
    return (
        <li
            className="menu nav-item relative !ml-0"
            onClick={() => navigate("/outward")}
        >
            <button type="button" className={`nav-link ${location.pathname.includes('/outward') ? 'active' : ''} `}>
                <div className="flex items-center">
                    <BsBoxArrowUp />
                    <span className="px-1">Outward</span>
                </div>
            </button>
        </li>
    )
}

export default Outward