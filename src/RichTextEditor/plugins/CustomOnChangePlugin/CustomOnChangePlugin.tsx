import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useEffect, useRef } from "react";

interface CustomOnChangePlugin {
  value: string;
  onChange: (value: string) => void;
}

const CustomOnChangePlugin = ({ value, onChange }: CustomOnChangePlugin) => {
  const [editor] = useLexicalComposerContext();
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    if (!value) return;
    const parsed = editor.parseEditorState(value);
    queueMicrotask(() => {
      editor.setEditorState(parsed);
    });
  }, [value, editor]);

  return (
    <OnChangePlugin
      ignoreSelectionChange
      ignoreHistoryMergeTagChange={false} 
      onChange={(editorState) => {
        const json = JSON.stringify(editorState.toJSON());
        onChange(json);
      }}
    />
  );
};

export default CustomOnChangePlugin;
