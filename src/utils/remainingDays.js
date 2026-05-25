export const remainingDays = (date) => {
    if (!date) return "-";

    const currentDate = new Date();
    const deadLineDate = new Date(date);

    const diffTime = deadLineDate - currentDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}