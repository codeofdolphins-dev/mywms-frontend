import Tippy from "@tippyjs/react";

const TwoLevelArrayViewer = ({
    data = [],
    labelKey,            // e.g. "name.full_name"
    placement = "right",
}) => {
    if (!Array.isArray(data) || data.length === 0) {
        return "-";
    }

    const getValueByPath = (obj, path) => {
        return path
            .split(".")
            .reduce((acc, key) => acc?.[key], obj);
    };

    return (
        <Tippy
            interactive
            placement={placement}
            content={
                <div className="max-w-xs p-3 space-y-2">
                    {data.map((item, idx) => (
                        <p key={idx} className="text-sm">
                            {getValueByPath(item, labelKey)}
                        </p>
                    ))}
                </div>
            }
        >
            <button
                type="button"
                className="text-primary font-semibold underline"
            >
                View ({data.length})
            </button>
        </Tippy>
    );
};

export default TwoLevelArrayViewer;
