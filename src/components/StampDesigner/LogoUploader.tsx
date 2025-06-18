
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X } from 'lucide-react';

interface LogoUploaderProps {
  includeLogo: boolean;
  logoImage?: string;
  logoPosition: 'top' | 'bottom' | 'left' | 'right' | 'center';
  onToggleLogo: () => void;
  onLogoUpload: (logoData: { logoImage: string }) => void;
  onPositionChange: (position: 'top' | 'bottom' | 'left' | 'right' | 'center') => void;
  highContrast?: boolean;
  largeControls?: boolean;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({
  includeLogo,
  logoImage,
  logoPosition,
  onToggleLogo,
  onLogoUpload,
  onPositionChange,
  highContrast = false,
  largeControls = false
}) => {
  const { t } = useTranslation();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoData = e.target?.result as string;
        onLogoUpload({ logoImage: logoData });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    onLogoUpload({ logoImage: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="include-logo"
          checked={includeLogo}
          onCheckedChange={onToggleLogo}
        />
        <Label htmlFor="include-logo" className={largeControls ? "text-lg" : ""}>
          {t('logo.includeLogo', 'Include Logo')}
        </Label>
      </div>

      {includeLogo && (
        <div className="space-y-4">
          {!logoImage ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <Label htmlFor="logo-upload" className="cursor-pointer">
                  <span className={`text-brand-blue hover:text-brand-blue/80 ${largeControls ? "text-lg" : ""}`}>
                    {t('logo.uploadLogo', 'Upload your logo')}
                  </span>
                  <input
                    id="logo-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </Label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {t('logo.supportedFormats', 'PNG, JPG, GIF up to 5MB')}
              </p>
            </div>
          ) : (
            <div className="relative">
              <img
                src={logoImage}
                alt="Uploaded logo"
                className="max-w-full h-32 object-contain mx-auto border rounded"
              />
              <Button
                onClick={removeLogo}
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
              >
                <X size={16} />
              </Button>
            </div>
          )}

          {logoImage && (
            <div>
              <Label className={`block mb-2 ${largeControls ? "text-lg" : ""}`}>
                {t('logo.position', 'Logo Position')}
              </Label>
              <Select value={logoPosition} onValueChange={onPositionChange}>
                <SelectTrigger className={largeControls ? "min-h-[52px] text-lg" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">{t('logo.top', 'Top')}</SelectItem>
                  <SelectItem value="bottom">{t('logo.bottom', 'Bottom')}</SelectItem>
                  <SelectItem value="left">{t('logo.left', 'Left')}</SelectItem>
                  <SelectItem value="right">{t('logo.right', 'Right')}</SelectItem>
                  <SelectItem value="center">{t('logo.center', 'Center')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LogoUploader;
