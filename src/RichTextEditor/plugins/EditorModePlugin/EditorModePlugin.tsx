import React from "react";
import type { EditorModes } from "../../RichTextEditor";
import "./EditorModePlugin.css";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

type ModeSwitcherProps = {
  mode: EditorModes;
  setMode: (mode: EditorModes) => void;
};

const EditorModePlugin: React.FC<ModeSwitcherProps> = ({ mode, setMode }) => {
  const [editor] = useLexicalComposerContext();

  const handleOnClick = (mode: EditorModes) => {
    setMode(mode);
    if (mode === "edit") {
      editor.setEditable(true);
    } else {
      editor.setEditable(false);
    }
  };

//   useEffect(() => {
//     editor.setEditable(mode === "edit");
//   }, [mode, editor]);

  return (
    <div className="mode-switcher">
      <button
        aria-label="View Mode"
        title="View Mode"
        className={`toolbar-item spaced ${mode === "view" ? "active" : ""}`}
        onClick={() => handleOnClick("view")}
      >
        <i className="format view-mode" />
      </button>
      <button
        aria-label="Read Mode"
        title="Read Mode"
        className={`toolbar-item spaced ${mode === "read" ? "active" : ""}`}
        onClick={() => handleOnClick("read")}
      >
        <i className="format read-mode" />
      </button>
      <button
        aria-label="Edit Mode"
        title="Edit Mode"
        className={` toolbar-item spaced ${mode === "edit" ? "active" : ""}`}
        onClick={() => handleOnClick("edit")}
      >
        <i className="format edit-mode" />
      </button>
    </div>
  );
};

export default EditorModePlugin;
