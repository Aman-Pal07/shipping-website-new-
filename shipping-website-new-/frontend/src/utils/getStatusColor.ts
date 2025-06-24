/**
 * Get the appropriate color for a package status
 * @param status Package status string
 * @returns CSS color class for the status
 */
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'waiting':
      return 'text-yellow-500 bg-yellow-100';
    case 'in_transit':
      return 'text-blue-500 bg-blue-100';
    case 'india':
      return 'text-purple-500 bg-purple-100';
    case 'dispatch':
      return 'text-orange-500 bg-orange-100';
    case 'delivered':
      return 'text-green-500 bg-green-100';
    case 'completed':
      return 'text-emerald-600 bg-emerald-100';
    case 'cancelled':
      return 'text-red-500 bg-red-100';
    case 'returned':
      return 'text-gray-500 bg-gray-100';
    default:
      return 'text-gray-500 bg-gray-100';
  }
};

/**
 * Get the appropriate icon name for a package status
 * @param status Package status string
 * @returns Icon name for the status
 */
export const getStatusIcon = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'waiting':
      return 'clock';
    case 'in_transit':
      return 'truck';
    case 'india':
      return 'map-pin';
    case 'dispatch':
      return 'package';
    case 'delivered':
      return 'check-circle';
    case 'completed':
      return 'credit-card';
    case 'cancelled':
      return 'x-circle';
    case 'returned':
      return 'rotate-ccw';
    default:
      return 'help-circle';
  }
};
