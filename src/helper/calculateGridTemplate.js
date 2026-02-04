export const getGridTemplate = (columns) =>
    columns
        .map(col => col.width ? col.width : "minmax(120px, 1fr)")
        .join(" ");
