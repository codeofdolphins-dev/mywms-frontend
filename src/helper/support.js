export const extractString = (str) => {
    if(!str) return;

    return str.split("_").join(" ").toUpperCase();
};