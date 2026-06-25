import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useState } from "react";
import { MdOutlineStorefront } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { IoClose } from "react-icons/io5";

const ConnectRoleModal = ({ isShow, setIsShow, rfqItem, onConfirm }) => {
    const [selectedRole, setSelectedRole] = useState(null);
    const [hoveredRole, setHoveredRole] = useState(null);

    const roles = [
        {
            id: "trader",
            label: "Connect as Trader",
            subtitle: "Buy & resell goods across the supply chain",
            Icon: MdOutlineStorefront,
            gradient: "from-violet-500 to-indigo-600",
            softBg: "bg-violet-50",
            border: "border-violet-300",
            activeBorder: "border-violet-500",
            ringColor: "ring-violet-300",
            textAccent: "text-violet-600",
            badgeColor: "bg-violet-100 text-violet-700",
        },
        {
            id: "supplier",
            label: "Connect as Supplier",
            subtitle: "Provide goods & fulfill purchase orders",
            Icon: TbTruckDelivery,
            gradient: "from-emerald-500 to-teal-600",
            softBg: "bg-emerald-50",
            border: "border-emerald-300",
            activeBorder: "border-emerald-500",
            ringColor: "ring-emerald-300",
            textAccent: "text-emerald-600",
            badgeColor: "bg-emerald-100 text-emerald-700",
        },
    ];

    const handleClose = () => {
        setSelectedRole(null);
        setIsShow(false);
    };

    const handleConfirm = () => {
        if (!selectedRole) return;
        onConfirm?.(selectedRole, rfqItem);
        handleClose();
    };

    // console.log(rfqItem)

    return (
        <Transition appear show={isShow} as={Fragment}>
            <Dialog as="div" onClose={handleClose}>
                {/* ── Backdrop ── */}
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm" />
                </TransitionChild>

                {/* ── Panel ── */}
                <div className="fixed inset-0 z-[1001] flex items-center justify-center px-4">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-90 translate-y-4"
                        enterTo="opacity-100 scale-100 translate-y-0"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100 translate-y-0"
                        leaveTo="opacity-0 scale-90 translate-y-4"
                    >
                        <DialogPanel className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

                            {/* ── Header ── */}
                            <div className="relative px-6 pt-6 pb-4">
                                <button
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    <IoClose size={20} />
                                </button>

                                <div className="flex items-center gap-3 mb-1">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-gray-800 leading-tight">Connect to {rfqItem?.meta?.name}</h2>
                                        {/* {rfqItem?.rfq_no && (
                                            <p className="text-xs text-gray-400 font-mono"># {rfqItem.rfq_no}</p>
                                        )} */}
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 mt-2">
                                    Choose how you want to connect with <span className="font-semibold">{rfqItem?.meta?.name}</span>.
                                </p>
                            </div>

                            <div className="h-px bg-gray-100 mx-6" />

                            {/* ── Role Cards ── */}
                            <div className="px-6 py-5 flex flex-col gap-3">
                                {roles.map((role) => {
                                    const isSelected = selectedRole === role.id;
                                    const isHovered = hoveredRole === role.id;
                                    return (
                                        <button
                                            key={role.id}
                                            onClick={() => setSelectedRole(role.id)}
                                            onMouseEnter={() => setHoveredRole(role.id)}
                                            onMouseLeave={() => setHoveredRole(null)}
                                            className={`
                                                w-full text-left rounded-xl border-2 p-4 transition-all duration-200 outline-none
                                                ${isSelected
                                                    ? `${role.activeBorder} ${role.softBg} shadow-md ring-2 ${role.ringColor}`
                                                    : `border-gray-200 hover:${role.border} hover:${role.softBg} bg-white`
                                                }
                                            `}
                                            style={{
                                                borderColor: isSelected ? undefined : isHovered ? '' : '',
                                            }}
                                        >
                                            <div className="flex items-center gap-4">
                                                {/* Icon bubble */}
                                                <div className={`
                                                    w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200
                                                    bg-gradient-to-br ${role.gradient}
                                                    ${isSelected ? 'shadow-lg scale-110' : 'opacity-80'}
                                                `}>
                                                    <role.Icon size={22} className="text-white" />
                                                </div>

                                                {/* Text */}
                                                <div className="flex-1 min-w-0">
                                                    <p className={`font-semibold text-sm ${isSelected ? role.textAccent : 'text-gray-800'}`}>
                                                        {role.label}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                                                        {role.subtitle}
                                                    </p>
                                                </div>

                                                {/* Selection indicator */}
                                                <div className={`
                                                    w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-200
                                                    ${isSelected
                                                        ? `bg-gradient-to-br ${role.gradient} border-transparent`
                                                        : 'border-gray-300 bg-white'
                                                    }
                                                `}>
                                                    {isSelected && (
                                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                            <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* ── Footer ── */}
                            <div className="px-6 pb-6 flex items-center gap-3">
                                <button
                                    onClick={handleClose}
                                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={!selectedRole}
                                    className={`
                                        flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                                        ${selectedRole
                                            ? 'bg-primary text-white hover:opacity-90 shadow-md hover:shadow-lg active:scale-[0.98]'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    Confirm Connection
                                </button>
                            </div>

                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ConnectRoleModal;
