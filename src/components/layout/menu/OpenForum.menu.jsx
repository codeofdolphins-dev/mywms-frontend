import React from 'react'
import IconCaretDown from '../../Icon/IconCaretDown'
import { NavLink, useNavigate } from 'react-router-dom'
import IconMenuDashboard from '../../Icon/Menu/IconMenuDashboard';
import { HiUserGroup } from 'react-icons/hi';

const OpenForum = ({ location }) => {
    const navigate = useNavigate();
    return (
        <li
            className="menu nav-item relative"
            onClick={() => navigate("/")}
        >
            <button type="button" className={`nav-link ${location.pathname === '/' ? 'active' : ''} `}>
                <div className="flex items-center">
                    <HiUserGroup className="shrink-0" />
                    <span className="px-1 whitespace-nowrap">Open Forum</span>
                </div>
            </button>
        </li>
    )
}

export default OpenForum;