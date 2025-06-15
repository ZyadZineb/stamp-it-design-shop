
import React from "react";

export interface DebugPanelProps {
  value: {
    grid: boolean;
    rulers: boolean;
    boundingBoxes: boolean;
    baseline: boolean;
  };
  onChange: (newVal: DebugPanelProps["value"]) => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ value, onChange }) => {
  const handleToggle = (name: keyof DebugPanelProps["value"]) => {
    onChange({ ...value, [name]: !value[name] });
  };

  return (
    <fieldset className="p-3 rounded-md border bg-gray-50 mb-2 text-xs flex gap-3 flex-wrap max-w-lg">
      <legend className="font-semibold text-gray-600 mb-1 px-2">Debug Overlays</legend>
      <label className="flex items-center gap-1 cursor-pointer">
        <input
          type="checkbox"
          checked={value.grid}
          onChange={() => handleToggle("grid")}
        />
        mm grid
      </label>
      <label className="flex items-center gap-1 cursor-pointer">
        <input
          type="checkbox"
          checked={value.rulers}
          onChange={() => handleToggle("rulers")}
        />
        Rulers
      </label>
      <label className="flex items-center gap-1 cursor-pointer">
        <input
          type="checkbox"
          checked={value.boundingBoxes}
          onChange={() => handleToggle("boundingBoxes")}
        />
        Bounding Boxes
      </label>
      <label className="flex items-center gap-1 cursor-pointer">
        <input
          type="checkbox"
          checked={value.baseline}
          onChange={() => handleToggle("baseline")}
        />
        Baselines
      </label>
    </fieldset>
  );
};

export default DebugPanel;
