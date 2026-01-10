/**
 * Formats data for table display.
 * Returns '---' if the value is null, undefined, or an empty string.
 * Otherwise returns the value.
 */
export const formatCellValue = (value: any): any => {
    if (value === null || value === undefined || value === '') {
        return '---';
    }
    return value;
};
