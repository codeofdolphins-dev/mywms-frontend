import React from 'react';
import { useLocation } from 'react-router-dom';
import { useNavAccess } from '../../hooks/useNavAccess';
import { NAV_CONFIG } from '../../config/navConfig';
import DynamicMenuItem from './menu/DynamicMenuItem';


const NavBar = () => {
    const location = useLocation();
    const { filterNav } = useNavAccess();

    const visibleMenuItems = filterNav(NAV_CONFIG);

    return (
        <div className="overflow-x-auto pb-[30rem] -mb-[30rem] pointer-events-none relative z-20 [&::-webkit-scrollbar]:hidden">
            <ul className="horizontal-menu pointer-events-auto flex w-max min-w-full flex-nowrap whitespace-nowrap gap-1 py-1.5 font-semibold px-6 lg:space-x-1.5 xl:space-x-8 bg-white border-t border-[#ebedf2] text-black">
                {visibleMenuItems.map((item) => (
                    <DynamicMenuItem key={item.key} item={item} location={location} />
                ))}
            </ul>
        </div>
    );
};

export default NavBar;