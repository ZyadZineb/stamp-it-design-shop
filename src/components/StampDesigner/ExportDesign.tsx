
import React from 'react';
import { Download, Share2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ExportDesignProps {
  svgRef: string | null;
  previewImage: string | null;
  productName: string;
  downloadAsPng: () => void;
}

const ExportDesign: React.FC<ExportDesignProps> = ({ 
  svgRef, 
  previewImage, 
  productName, 
  downloadAsPng 
}) => {
  const { toast } = useToast();
  
  const handleDownloadSVG = () => {
    if (!svgRef) {
      toast({
        title: "Cannot export design",
        description: "No design to export",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const blob = new Blob([svgRef], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${productName.replace(/\s+/g, '-')}-stamp.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting SVG:", error);
      toast({
        title: "Failed to export SVG",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };
  
  const handleShare = async () => {
    if (!previewImage) {
      toast({
        title: "Cannot share design",
        description: "No design to share",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (navigator.share) {
        // Convert data URL to Blob
        const response = await fetch(previewImage);
        const blob = await response.blob();
        const file = new File([blob], `${productName.replace(/\s+/g, '-')}-stamp.png`, { type: blob.type });
        
        await navigator.share({
          title: 'My Custom Stamp Design',
          text: 'Check out my custom stamp design!',
          files: [file]
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        toast({
          title: "Sharing not supported",
          description: "Your browser doesn't support direct sharing. Try downloading and sharing manually.",
        });
      }
    } catch (error) {
      console.error("Error sharing design:", error);
      toast({
        title: "Failed to share design",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-800">Export & Share</h3>
      
      <div className="space-y-2">
        <Label htmlFor="export-format">Export Format</Label>
        <Select defaultValue="png">
          <SelectTrigger id="export-format">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="png">PNG Image</SelectItem>
            <SelectItem value="svg">SVG Vector</SelectItem>
            <SelectItem value="pdf">PDF Document (Coming Soon)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-col gap-2">
        <Button 
          onClick={downloadAsPng} 
          variant="outline"
          className="flex items-center gap-2 w-full"
        >
          <Download size={16} />
          Download as PNG
        </Button>
        
        <Button 
          onClick={handleDownloadSVG} 
          variant="outline"
          className="flex items-center gap-2 w-full"
        >
          <Download size={16} />
          Download as SVG
        </Button>
        
        <Button 
          onClick={handleShare} 
          variant="outline"
          className="flex items-center gap-2 w-full"
        >
          <Share2 size={16} />
          Share Design
        </Button>
      </div>
    </div>
  );
};

export default ExportDesign;
