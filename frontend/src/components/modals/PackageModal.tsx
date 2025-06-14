import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PackageModal({ isOpen, onClose, onSuccess }: PackageModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    trackingId: `TRK${Math.floor(100000 + Math.random() * 900000)}`,
    weight: '',
    weightUnit: 'kg',
    content: '',
    destinationAddress: '',
    priority: 'standard',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would typically make an API call to create the package
      // For example:
      // await apiRequest('POST', '/api/packages', formData);
      
      // For now, we'll just log and close
      console.log('Package created:', formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating package:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Package</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trackingId">Tracking ID</Label>
              <Input 
                id="trackingId" 
                name="trackingId" 
                value={formData.trackingId} 
                onChange={handleChange} 
                disabled 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <div className="flex space-x-2">
                <Input 
                  id="weight" 
                  name="weight" 
                  type="number" 
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
                <Select 
                  value={formData.weightUnit} 
                  onValueChange={(value) => handleSelectChange('weightUnit', value)}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content Description</Label>
            <Textarea 
              id="content" 
              name="content" 
              value={formData.content}
              onChange={handleChange}
              placeholder="Brief description of package contents"
              rows={2}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destinationAddress">Destination Address</Label>
            <Textarea 
              id="destinationAddress" 
              name="destinationAddress" 
              value={formData.destinationAddress}
              onChange={handleChange}
              placeholder="Full delivery address"
              rows={2}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">Shipping Priority</Label>
            <Select 
              value={formData.priority} 
              onValueChange={(value) => handleSelectChange('priority', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="express">Express</SelectItem>
                <SelectItem value="overnight">Overnight</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea 
              id="notes" 
              name="notes" 
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any special instructions or notes"
              rows={2}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Package'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
