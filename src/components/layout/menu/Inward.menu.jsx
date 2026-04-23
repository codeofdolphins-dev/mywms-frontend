import React from 'react';
import { BsBoxArrowInDown } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const Inward = ({ location }) => {
    const navigate = useNavigate();
    return (
        <li
            className="menu nav-item relative !ml-0"
            onClick={() => navigate("/inward")}
        >
            <button type="button" className={`nav-link ${location.pathname.includes('/inward') ? 'active' : ''} `}>
                <div className="flex items-center">
                    <BsBoxArrowInDown />
                    <span className="px-1">Inward</span>
                </div>
            </button>
        </li>
    )
}

export default Inward