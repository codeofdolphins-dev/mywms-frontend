export const RHFToFormData = (data) => {
    const fd = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        // Handle null or undefined values to avoid string "null" / "undefined" in FormData
        if (value === null || value === undefined) {
            fd.append(key, "");
            return;
        }

        // Handle FileList (from react-hook-form)
        if (value instanceof FileList && value.length > 0) {
            fd.append(key, value[0]);
            return;
        }

        // Handle single File
        if (value instanceof File) {
            fd.append(key, value);
            return;
        }

        // Handle plain objects (like `node`)
        if (typeof value === "object") {
            fd.append(key, JSON.stringify(value));
            return;
        }

        // Handle primitives (string, number, boolean)
        fd.append(key, value);
    });

    return fd;
};
