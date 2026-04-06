function StatCard({ icon, label, value, accent = "primary", subtitle }) {
    const accentMap = {
        primary: {
            bg: "bg-primary/10",
            text: "text-primary",
            border: "border-primary/20",
            ring: "ring-primary/5",
        },
        success: {
            bg: "bg-success/10",
            text: "text-success",
            border: "border-success/20",
            ring: "ring-success/5",
        },
        warning: {
            bg: "bg-warning/10",
            text: "text-warning",
            border: "border-warning/20",
            ring: "ring-warning/5",
        },
        danger: {
            bg: "bg-danger/10",
            text: "text-danger",
            border: "border-danger/20",
            ring: "ring-danger/5",
        },
        info: {
            bg: "bg-info/10",
            text: "text-info",
            border: "border-info/20",
            ring: "ring-info/5",
        },
        secondary: {
            bg: "bg-secondary/10",
            text: "text-secondary",
            border: "border-secondary/20",
            ring: "ring-secondary/5",
        },
    };

    const a = accentMap[accent] || accentMap.primary;

    return (
        <div className={`panel !p-4 border ${a.border} ring-1 ${a.ring} hover:shadow-md transition-shadow duration-300 group`}>
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${a.bg} ${a.text} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>
                <div className="min-w-0">
                    <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider truncate">{label}</p>
                    <p className="text-lg font-bold text-gray-800 truncate leading-tight mt-0.5">{value}</p>
                    {subtitle && <p className="text-[10px] text-gray-400 mt-0.5">{subtitle}</p>}
                </div>
            </div>
        </div>
    );
}

export default StatCard;