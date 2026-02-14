export const utcToLocal = (date) => {
    const newDate = new Date(date);

    // Check if invalid
    if (isNaN(newDate.getTime())) {
        return null;
    }

    return newDate.toLocaleString("en-Us", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}