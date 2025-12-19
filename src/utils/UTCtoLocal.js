export const utcToLocal = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleString("en-Us", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}