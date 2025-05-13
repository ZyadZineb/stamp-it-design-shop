
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface StampPreviewProps {
  previewImage: string | null;
  productSize: string;
  previewRef: React.RefObject<HTMLDivElement>;
  isDragging: boolean;
  activeLineIndex: number | null;
  includeLogo: boolean;
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp: () => void;
  onTouchStart: (event: React.TouchEvent<HTMLDivElement>) => void;
  onTouchMove: (event: React.TouchEvent<HTMLDivElement>) => void;
  downloadAsPng: () => void;
}

const StampPreview: React.FC<StampPreviewProps> = ({
  previewImage,
  productSize,
  previewRef,
  isDragging,
  activeLineIndex,
  includeLogo,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  downloadAsPng
}) => {
  return (
    <div className="border rounded-md p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-800">Live Preview</h3>
        <div className="flex gap-2">
          <p className="text-xs text-gray-600 self-center">
            {productSize} mm
          </p>
          <Button 
            onClick={downloadAsPng}
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            disabled={!previewImage}
          >
            <Download size={16} />
            Download PNG
          </Button>
        </div>
      </div>
      <div 
        className="flex justify-center items-center bg-white border rounded-md p-4 min-h-60 cursor-pointer relative touch-none"
        ref={previewRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onMouseUp}
      >
        {previewImage ? (
          <>
            <img 
              src={previewImage} 
              alt="Stamp Preview" 
              className="max-w-full max-h-48 pointer-events-none"
              draggable="false"
            />
            {(activeLineIndex !== null || includeLogo) && !isDragging && (
              <div className="absolute inset-0 bg-blue-500/5 flex items-center justify-center pointer-events-none">
                <p className="bg-white/90 text-xs px-3 py-1 rounded-lg shadow text-gray-600">
                  {activeLineIndex !== null ? 
                    `Drag to position Line ${activeLineIndex + 1}` : 
                    "Drag to position Logo"}
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-center">
            Start designing to see a preview
          </p>
        )}
      </div>
      {isDragging ? (
        <div className="mt-2 text-sm text-center text-blue-600 bg-blue-50 p-2 rounded">
          <p>Release to set position</p>
        </div>
      ) : activeLineIndex !== null ? (
        <div className="mt-2 text-sm text-center text-blue-600 bg-blue-50 p-2 rounded">
          <p>Click and drag in the preview area to position Line {activeLineIndex + 1}</p>
        </div>
      ) : includeLogo ? (
        <div className="mt-2 text-sm text-center text-blue-600 bg-blue-50 p-2 rounded">
          <p>Click and drag in the preview area to position your logo</p>
        </div>
      ) : null}
    </div>
  );
};

export default StampPreview;
