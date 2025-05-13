
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StampDesign } from '@/types';
import { DesignTemplate, stampTemplates } from '@/data/stampTemplates';
import { FileSparkles } from 'lucide-react';

interface TemplateGalleryProps {
  onApplyTemplate: (design: StampDesign) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onApplyTemplate }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelectTemplate = (template: DesignTemplate) => {
    onApplyTemplate(template.design);
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <FileSparkles size={16} />
        Start with a Template
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choose a Template</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {stampTemplates.map((template) => (
              <div 
                key={template.id} 
                className="border rounded-md overflow-hidden hover:border-brand-blue transition-colors cursor-pointer"
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="p-3 bg-gray-50 border-b">
                  <h3 className="font-medium text-sm">{template.name}</h3>
                </div>
                <div className="p-3">
                  <div className="bg-white rounded aspect-video flex items-center justify-center mb-2">
                    <img 
                      src={template.preview} 
                      alt={template.name} 
                      className="max-w-full max-h-32 object-contain"
                    />
                  </div>
                  <p className="text-xs text-gray-600">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
