import { getStatusColor, getStatusIcon } from '../utils/getStatusColor';

interface PackageStatusHook {
  getStatusLabel: (status: string) => string;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => string;
  getNextStatus: (currentStatus: string) => string | null;
  getPreviousStatus: (currentStatus: string) => string | null;
  getAllStatuses: () => string[];
}

/**
 * Custom hook to handle package status operations
 * @returns Object with status utility functions
 */
export const usePackageStatus = (): PackageStatusHook => {
  const statusOrder = [
    'waiting',
    'in_transit',
    'india',
    'dispatch',
    'delivered',
    'completed',
  ];

  const statusLabels: Record<string, string> = {
    'waiting': 'Waiting',
    'in_transit': 'In Transit',
    'india': 'Arrived in India',
    'dispatch': 'Out for Delivery',
    'delivered': 'Delivered',
    'completed': 'Completed & Paid',
    'cancelled': 'Cancelled',
    'returned': 'Returned',
  };

  const getStatusLabel = (status: string): string => {
    return statusLabels[status.toLowerCase()] || status;
  };

  const getNextStatus = (currentStatus: string): string | null => {
    const currentIndex = statusOrder.indexOf(currentStatus.toLowerCase());
    if (currentIndex === -1 || currentIndex === statusOrder.length - 1) {
      return null;
    }
    return statusOrder[currentIndex + 1];
  };

  const getPreviousStatus = (currentStatus: string): string | null => {
    const currentIndex = statusOrder.indexOf(currentStatus.toLowerCase());
    if (currentIndex <= 0) {
      return null;
    }
    return statusOrder[currentIndex - 1];
  };

  const getAllStatuses = (): string[] => {
    return [...statusOrder, 'cancelled', 'returned'];
  };

  return {
    getStatusLabel,
    getStatusColor,
    getStatusIcon,
    getNextStatus,
    getPreviousStatus,
    getAllStatuses,
  };
};
