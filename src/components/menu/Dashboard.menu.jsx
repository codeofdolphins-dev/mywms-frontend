import React from 'react'
import IconCaretDown from '../Icon/IconCaretDown'
import { NavLink, useNavigate } from 'react-router-dom'
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';

const Dashboard = ({ location }) => {
    const navigate = useNavigate();
    return (
        <li
            className="menu nav-item relative"
            onClick={() => navigate("/")}
        >
            <button type="button" className={`nav-link ${location.pathname === '/' ? 'active' : ''} `}>
                <div className="flex items-center">
                    <IconMenuDashboard className="shrink-0" />
                    <span className="px-1">Dashboard</span>
                </div>
                <div className="right_arrow">
                    <IconCaretDown />
                </div>
            </button>
            <ul className="sub-menu">
                <li>
                    <NavLink to="/">{'sales'}</NavLink>
                </li>
            </ul>
        </li>
    )
}

export default Dashboard