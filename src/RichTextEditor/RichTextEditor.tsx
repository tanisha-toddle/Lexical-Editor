import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ParagraphNode, TextNode } from "lexical";
import { HeadingNode } from "@lexical/rich-text";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import React, { useMemo } from "react";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import "./styles.css";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin/ToolbarPlugin";
import theme from "./theme";
import CustomOnChangePlugin from "./plugins/CustomOnChangePlugin/CustomOnChangePlugin";

function onError(error: Error) {
  console.log(error);
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  name: string;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  name,
  placeholder = "Enter some rich text...",
}) => {
  const initialConfig = useMemo(
    () => ({
      namespace: name,
      theme,
      onError,
      nodes: [
        ParagraphNode,
        TextNode,
        HeadingNode,
        CodeHighlightNode,
        CodeNode,
      ],
    }),
    [name],
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        <ToolbarPlugin />

        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                aria-placeholder={placeholder}
                placeholder={
                  <div className="editor-placeholder">{placeholder}</div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <CustomOnChangePlugin value={value} onChange={onChange} />
        </div>
      </div>
    </LexicalComposer>
  );
};

export default RichTextEditor;

// every plugin has access to editor through lexical composer context
