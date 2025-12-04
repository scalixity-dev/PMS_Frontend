/**
 * Get the status color class for a unit or property status
 * @param status - The status of the unit/property ('Occupied', 'Vacant', 'Partially Occupied')
 * @returns Tailwind CSS background color class
 */
export const getStatusColor = (status: string): string => {
    switch (status) {
        case 'Occupied':
            return 'bg-[#82D64D]';
        case 'Vacant':
            return 'bg-gray-500';
        case 'Partially Occupied':
            return 'bg-[#FDB022]';
        default:
            return 'bg-gray-500';
    }
};
