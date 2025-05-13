
import React, { useState } from 'react';
import { Trash2, Save, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SavedDesign } from '@/hooks/useStampDesigner';

interface SavedDesignsProps {
  savedDesigns: SavedDesign[];
  onLoad: (designId: string) => void;
  onSave: (name: string) => void;
  onDelete: (designId: string) => void;
}

export const SavedDesigns: React.FC<SavedDesignsProps> = ({ 
  savedDesigns, 
  onLoad, 
  onSave, 
  onDelete 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [designName, setDesignName] = useState('');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleSave = () => {
    if (designName.trim()) {
      onSave(designName.trim());
      setSaveDialogOpen(false);
      setDesignName('');
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Upload size={16} />
        Saved Designs
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Saved Designs</DialogTitle>
          </DialogHeader>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => setSaveDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Save size={16} />
              Save Current Design
            </Button>
          </div>
          
          {savedDesigns.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">You don't have any saved designs yet.</p>
              <p className="text-sm text-gray-400 mt-2">
                Save your current design to access it later, even on another device.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {savedDesigns.map((design) => (
                <div key={design.id} className="border rounded-md overflow-hidden">
                  <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                    <h3 className="font-medium text-sm">{design.name}</h3>
                    <span className="text-xs text-gray-500">{formatDate(design.date)}</span>
                  </div>
                  <div className="p-3 flex flex-col gap-3">
                    <div className="bg-white border rounded aspect-video flex items-center justify-center p-2">
                      {design.previewImage ? (
                        <img 
                          src={design.previewImage} 
                          alt={design.name} 
                          className="max-w-full max-h-24 object-contain"
                        />
                      ) : (
                        <div className="text-gray-400 text-xs">No preview</div>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onDelete(design.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        Delete
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => {
                          onLoad(design.id);
                          setIsOpen(false);
                        }}
                      >
                        Load Design
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Your Design</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="design-name">Design Name</Label>
              <Input 
                id="design-name"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                placeholder="My Custom Stamp"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!designName.trim()}>
              Save Design
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
