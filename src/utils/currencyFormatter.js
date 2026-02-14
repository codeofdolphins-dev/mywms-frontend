/**
 * 
 * @param {number} amount 
 * @returns number
 */
export function currencyFormatter(amount) {

    if(isNaN(amount)) return null;

    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2, // Ensure two decimal places are displayed
        maximumFractionDigits: 2
    });

    return formatter.format(amount);
}