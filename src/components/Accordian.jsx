import React, { useState } from 'react'
import AnimateHeight from 'react-animate-height';
import IconCaretDown from './Icon/IconCaretDown';

const Accordian = ({
    id,
    header = "Header",
    children,
}) => {

    const [active, setActive] = useState('0');
    const togglePara = (value) => {
        setActive((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    return (
        <div className="border border-[#d3d3d3] rounded">
            <button
                type="button"
                className={`p-4 w-full flex items-center text-white-dark ${(active === `${id}`) ? '!text-primary' : ''}`}
                onClick={() => togglePara(`${id}`)}

            >
                {header}
                <div className={`ml-auto ${active === `${id}` ? 'rotate-180' : ''}`}>
                    <IconCaretDown />
                </div>
            </button>
            <div>
                <AnimateHeight duration={300} height={active === `${id}` ? 'auto' : 0}>
                    <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3]">
                        {children}
                    </div>
                </AnimateHeight>
            </div>
        </div>
    )
}

export default Accordian