
import React, { useState, useEffect } from 'react';
import { QrCode, Loader } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { HelpTooltip } from '@/components/ui/tooltip-custom';
import LoadingButton from './LoadingButton';

interface QrCodeGeneratorProps {
  onGenerate: (dataUrl: string) => void;
  largeControls?: boolean;
}

const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = ({ 
  onGenerate, 
  largeControls = false 
}) => {
  const { toast } = useToast();
  const [qrValue, setQrValue] = useState('https://');
  const [qrSize, setQrSize] = useState(200);
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [withLogo, setWithLogo] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateQrCode = async () => {
    if (!qrValue || qrValue === 'https://') {
      toast({
        title: "Cannot generate QR code",
        description: "Please enter a valid URL or text",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const googleChartsUrl = 'https://chart.googleapis.com/chart?cht=qr' + 
        `&chs=${qrSize}x${qrSize}` +
        `&chl=${encodeURIComponent(qrValue)}` +
        `&chco=${darkColor.substring(1)}` +
        `&chf=bg,s,${lightColor.substring(1)}`;
      
      setQrImage(googleChartsUrl);
      onGenerate(googleChartsUrl);
      
      toast({
        title: "QR code generated",
        description: "Add it to your stamp design",
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast({
        title: "Failed to generate QR code",
        description: "Please try again with different parameters",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className={`font-medium text-gray-800 ${largeControls ? "text-lg" : ""}`}>
        QR Code Generator
      </h3>
      
      <div className="space-y-4">
        <div className="grid gap-2">
          <HelpTooltip content="Enter the URL or text you want to encode in the QR code">
            <Label htmlFor="qr-url" className="flex items-center gap-1">
              URL or Text
            </Label>
          </HelpTooltip>
          <Input
            id="qr-url"
            value={qrValue}
            onChange={(e) => setQrValue(e.target.value)}
            placeholder="https://example.com"
            className={`w-full min-h-[44px] focus-visible:outline-2 focus-visible:outline-blue-500 ${largeControls ? "text-lg p-3" : ""}`}
            aria-describedby="qr-url-help"
          />
          <span id="qr-url-help" className="text-xs text-gray-500">
            Enter any URL, email, phone number, or text
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <HelpTooltip content="Choose the color for the QR code pattern">
              <Label htmlFor="qr-foreground" className="flex items-center gap-1">
                Foreground Color
              </Label>
            </HelpTooltip>
            <div className="flex gap-2 items-center mt-1">
              <Input
                id="qr-foreground"
                type="color"
                value={darkColor}
                onChange={(e) => setDarkColor(e.target.value)}
                className="w-16 h-10 p-1 border rounded focus-visible:outline-2 focus-visible:outline-blue-500"
                title="QR code foreground color"
              />
              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{darkColor}</span>
            </div>
          </div>
          
          <div>
            <HelpTooltip content="Choose the background color for the QR code">
              <Label htmlFor="qr-background" className="flex items-center gap-1">
                Background Color
              </Label>
            </HelpTooltip>
            <div className="flex gap-2 items-center mt-1">
              <Input
                id="qr-background"
                type="color"
                value={lightColor}
                onChange={(e) => setLightColor(e.target.value)}
                className="w-16 h-10 p-1 border rounded focus-visible:outline-2 focus-visible:outline-blue-500"
                title="QR code background color"
              />
              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{lightColor}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="with-logo" 
            checked={withLogo} 
            onCheckedChange={setWithLogo}
            className="focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
          />
          <HelpTooltip content="Feature coming soon - add your logo to the center of the QR code">
            <Label htmlFor="with-logo" className="flex items-center gap-1 cursor-pointer">
              Add logo to center (coming soon)
            </Label>
          </HelpTooltip>
        </div>
      </div>
      
      <LoadingButton 
        onClick={generateQrCode}
        loading={isGenerating}
        loadingText="Generating..."
        className={`w-full flex items-center gap-2 ${largeControls ? "text-lg py-6" : ""}`}
        disabled={!qrValue || qrValue === 'https://'}
      >
        <QrCode size={largeControls ? 24 : 16} />
        Generate QR Code
      </LoadingButton>
      
      {qrImage && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-600 mb-3 text-center">Preview:</p>
          <div className="flex justify-center">
            <img 
              src={qrImage} 
              alt="Generated QR Code" 
              className="border rounded-md shadow-sm max-w-48 h-auto"
            />
          </div>
          <p className="text-xs text-center text-gray-500 mt-2">
            Click "Generate QR Code" again to update with new settings
          </p>
        </div>
      )}
    </div>
  );
};

export default QrCodeGenerator;
