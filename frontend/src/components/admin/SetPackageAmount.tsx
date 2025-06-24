import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Package } from '../../types/package';
import { AppDispatch } from '../../store';
import { updatePackage } from '../../features/packages/packageSlice';
import { DollarSign, Check, X } from 'lucide-react';

interface SetPackageAmountProps {
  packageItem: Package;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function SetPackageAmount({ packageItem, onSuccess, onCancel }: SetPackageAmountProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [amount, setAmount] = useState<string>(packageItem.amount ? packageItem.amount.toString() : '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await dispatch(updatePackage({
        id: packageItem.id,
        updates: {
          amount: parseFloat(amount)
        }
      })).unwrap();
      
      setIsEditing(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update amount');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    if (onCancel) {
      onCancel();
    }
  };

  if (!isEditing) {
    return (
      <div className="flex items-center">
        <span className="mr-2">
          {packageItem.amount 
            ? `₹${packageItem.amount.toLocaleString()}`
            : <span className="text-gray-400">No amount set</span>
          }
        </span>
        <button 
          onClick={() => setIsEditing(true)}
          className="p-1 hover:bg-muted rounded-md text-blue-500"
          title="Set Amount"
        >
          <DollarSign className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded-md text-sm w-24"
          placeholder="Amount"
        />
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="p-1 rounded-full hover:bg-green-100 text-green-600"
          title="Save amount"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Check className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="p-1 rounded-full hover:bg-red-100 text-red-600"
          title="Cancel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
