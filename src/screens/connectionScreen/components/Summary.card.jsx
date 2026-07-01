import React from 'react'

const SummaryCard = ({ card }) => {
    return (
        <div
            className={`panel bg-gradient-to-br ${card.color} border-0 flex items-center gap-4 py-4`}
        >
            <div className={`w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center ${card.textColor} shadow-sm`}>
                {card.icon}
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-800 leading-none">{card.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                    {card.label} Connection{card.value !== 1 ? "s" : ""}
                </p>
            </div>
        </div>
    )
}

export default SummaryCard