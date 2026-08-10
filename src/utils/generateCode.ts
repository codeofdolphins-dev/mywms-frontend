export const generateCode = (prefix: string, id: number): string => {
    const year = new Date().getFullYear()
    const month = new Date().toLocaleString("default", { month: "short" });

    return `${prefix}-${year}-${month}-${id}`;
}