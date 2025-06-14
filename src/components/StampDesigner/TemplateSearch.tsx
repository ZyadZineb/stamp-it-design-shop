
import React, { useState } from "react";

// This is a stub; integration with a web template API is not provided for security.
const industries = ["Legal", "Medical", "Business", "Education"];
const shapes = ["Circular", "Rectangular", "Square"];
const styles = ["Minimal", "Traditional", "Modern"];
const purposes = ["Address", "Signature", "Date", "Custom"];

const TemplateSearch = () => {
  const [industry, setIndustry] = useState("");
  const [shape, setShape] = useState("");
  const [style, setStyle] = useState("");
  const [purpose, setPurpose] = useState("");

  // No API fetch yet—just shows UI logic
  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      <h2 className="font-bold text-lg mb-2">Search Web Templates</h2>
      <div className="grid gap-2 mb-2">
        <label>
          Industry:
          <select className="ml-2" value={industry} onChange={e => setIndustry(e.target.value)}>
            <option value="">Any</option>
            {industries.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </label>
        <label>
          Shape:
          <select className="ml-2" value={shape} onChange={e => setShape(e.target.value)}>
            <option value="">Any</option>
            {shapes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label>
          Style:
          <select className="ml-2" value={style} onChange={e => setStyle(e.target.value)}>
            <option value="">Any</option>
            {styles.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label>
          Purpose:
          <select className="ml-2" value={purpose} onChange={e => setPurpose(e.target.value)}>
            <option value="">Any</option>
            {purposes.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
      </div>
      {/* Example placeholder: would show matches below */}
      <div className="mt-4 text-center text-gray-500">
        <span>No online templates loaded yet.</span>
      </div>
    </div>
  );
};

export default TemplateSearch;
