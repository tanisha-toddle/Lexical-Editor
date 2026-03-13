import React, { useState } from "react";
import RichTextEditor from "./RichTextEditor/RichTextEditor";

export const STORAGE_KEY = "RichTextEditor";

const App = () => {
  const [value, setValue] = useState<string>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData || "";
  });

  const handleSave = () => {
    if (value) {
      localStorage.setItem(STORAGE_KEY, value);
    } 
  };

  return (
    <div className="container">
      <h1>React.js Rich Text Lexical Example</h1>
      <RichTextEditor value={value} onChange={setValue} name="RichTextEditor" />
      <button className="save-button" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default App;
