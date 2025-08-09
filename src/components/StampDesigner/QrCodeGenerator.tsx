
import React, { useState } from 'react';
import { QrCode } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { HelpTooltip } from '@/components/ui/tooltip-custom';
import LoadingButton from './LoadingButton';
import QRCode from 'qrcode';

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
        title: 'Cannot generate QR code',
        description: 'Please enter a valid URL or text',
        variant: 'destructive'
      });
      return;
    }
    setIsGenerating(true);
    try {
      const dataUrl = await QRCode.toDataURL(qrValue, {
        margin: 0,
        width: qrSize,
        color: {
          dark: darkColor,
          light: lightColor
        }
      });
      setQrImage(dataUrl);
      onGenerate(dataUrl);
      toast({ title: 'QR code generated', description: 'Add it to your stamp design' });
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({ title: 'Failed to generate QR code', description: 'Please try again', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className={`font-medium text-gray-800 ${largeControls ? 'text-lg' : ''}`}>
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
            className={`w-full min-h-[44px] focus-visible:outline-2 focus-visible:outline-blue-500 ${largeControls ? 'text-lg p-3' : ''}`}
            aria-describedby="qr-url-help"
          />
          <span id="qr-url-help" className="text-xs text-gray-500">
            Enter any URL, email, phone number, or text
          </span>
        </div>
        
        {/* Color pickers removed for brevity in UI but colors still applied */}
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
        className={`w-full flex items-center gap-2 ${largeControls ? 'text-lg py-6' : ''}`}
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
              loading="lazy"
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
