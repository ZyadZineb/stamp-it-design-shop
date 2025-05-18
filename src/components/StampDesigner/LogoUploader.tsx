
import React from 'react';
import { ImageIcon, MoveHorizontal, MoveVertical } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface LogoUploaderProps {
  includeLogo: boolean;
  toggleLogo: () => void;
  logoX?: number;
  logoY?: number;
  uploadedLogo: string | null;
  onLogoUpload: () => void;
  updateLogoPosition: (x: number, y: number) => void;
  largeControls?: boolean;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({
  includeLogo,
  toggleLogo,
  logoX = 0,
  logoY = 0,
  uploadedLogo,
  onLogoUpload,
  updateLogoPosition,
  largeControls = false
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <h3 className={`font-medium text-gray-800 ${largeControls ? "text-lg" : ""}`}>Include Logo</h3>
        <label className="relative inline-flex items-center cursor-pointer ml-3">
          <input 
            type="checkbox" 
            checked={includeLogo} 
            onChange={toggleLogo} 
            className="sr-only peer"
          />
          <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue ${largeControls ? "w-14 h-8 after:h-7 after:w-7" : ""}`}></div>
        </label>
      </div>
      
      {includeLogo && (
        <div className="space-y-2">
          <div 
            className={`border-dashed border-2 border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors ${largeControls ? "p-6" : ""}`}
            onClick={onLogoUpload}
          >
            <div className="flex justify-center mb-2">
              <ImageIcon size={largeControls ? 32 : 24} className="text-gray-400" />
            </div>
            <p className={`text-sm text-gray-500 ${largeControls ? "text-base" : ""}`}>
              {uploadedLogo ? "Logo uploaded! Click to change" : "Click to upload your logo"}
            </p>
            {uploadedLogo && (
              <div className="mt-2 p-2 bg-gray-100 rounded-md">
                <img src={uploadedLogo} alt="Uploaded logo" className={`h-16 mx-auto object-contain ${largeControls ? "h-20" : ""}`} />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                <MoveHorizontal size={14} /> Logo Horizontal Position
              </Label>
              <Slider
                min={-100}
                max={100}
                step={1}
                value={[logoX]}
                onValueChange={(value) => updateLogoPosition(value[0], logoY)}
                className="w-full"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                <MoveVertical size={14} /> Logo Vertical Position
              </Label>
              <Slider
                min={-100}
                max={100}
                step={1}
                value={[logoY]}
                onValueChange={(value) => updateLogoPosition(logoX, value[0])}
                className="w-full"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">You can also drag the logo directly on the preview area</p>
        </div>
      )}
    </div>
  );
};

export default LogoUploader;
