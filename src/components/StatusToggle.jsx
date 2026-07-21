import React, { useState } from 'react';
import { errorAlert } from '../utils/alerts';
import masterData from '../Backend/master.backend';
import { RHFToFormData } from '../utils/RHFtoFD';

const StatusToggle = ({ isActive, productId }) => {

    const { mutateAsync: updateData, isPending: updatePending } = masterData.TQUpdateMaster(["productList"])


    const [checked, setChecked] = useState(Boolean(isActive));
    const [loading, setLoading] = useState(false);

    const handleToggle = (e) => {
        e.stopPropagation();
        const newStatus = !checked;
        setChecked(newStatus);
        setLoading(true);

        const formData = RHFToFormData({ is_active: newStatus, id: productId });

        updateData({ path: `/product/update`, formData })
            .then(() => {

            })
            .catch(() => {
                setChecked(!newStatus);
            })
            .finally(() => setLoading(false))
    };

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={handleToggle}
                disabled={loading}
                className="group relative inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-wait"
                style={{
                    backgroundColor: checked ? '#00ab55' : '#e0e0e0',
                }}
            >
                {/* Knob */}
                <span
                    className="inline-block h-3 w-3 rounded-full bg-white shadow-md transition-all duration-300 ease-in-out"
                    style={{
                        transform: checked ? 'translateX(18px)' : 'translateX(2px)',
                    }}
                />
            </button>

            {/* Status badge */}
            <span
                className={`
                    inline-block text-xs font-semibold px-2 py-0.5 rounded-md select-none transition-all duration-300
                    ${checked
                        ? 'bg-[#00ab55]/10 text-[#00ab55]'
                        : 'bg-[#e7515a]/10 text-[#e7515a]'
                    }
                `}
            >
                {checked ? 'Active' : 'Inactive'}
            </span>
        </div>
    );
};

export default StatusToggle;
