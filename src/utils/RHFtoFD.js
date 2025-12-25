export const RHFToFormData = (data) => {
    const fd = new FormData();

    Object.entries(data).forEach(([k, v]) => {
        if (v instanceof FileList && v.length) {
            fd.append(k, v[0]);
        } else {
            fd.append(k, v);
        }
    });

    return fd;
};
