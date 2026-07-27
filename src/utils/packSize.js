/**
 * Build a readable pack size from a product's details.
 * e.g. { measure: "375", unit_type: "ml", package_type: "bottol" } -> "375 ml bottol"
 *
 * @param {object} details
 * @returns string
 */
export function packSize(details) {
    return [details?.measure, details?.unit_type, details?.package_type].filter(Boolean).join(" ");
}
