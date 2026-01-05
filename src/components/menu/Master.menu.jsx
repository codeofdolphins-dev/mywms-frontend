import React from 'react'
import { HiDatabase } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom'

const Master = ({ location }) => {
    const navigate = useNavigate();
    return (
        <li
            className="menu nav-item relative !ml-0"
            onClick={() => navigate("/master")}
        >
            <button type="button" className={`nav-link ${location.pathname === '/master' ? 'active' : ''} `}>
                <div className="flex items-center">
                    <HiDatabase />
                    <span className="px-1">Master</span>
                </div>
            </button>
        </li>
    )
}

export default Master