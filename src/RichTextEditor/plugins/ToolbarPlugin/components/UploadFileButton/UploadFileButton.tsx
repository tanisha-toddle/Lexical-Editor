import type { LexicalEditor } from "lexical";
import React, { useCallback, useRef } from "react";
import { INSERT_MEDIA_CARD_COMMAND } from "../../../../commands/MediaCardNodeCommands";

const UploadFileButton = ({
  editor,
  isDisabled,
}: {
  editor: LexicalEditor;
  isDisabled: boolean;
}) => {
    
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    editor.dispatchCommand(INSERT_MEDIA_CARD_COMMAND, files);
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOnClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current?.click();
    }
  }, [inputRef]);

  return (
    <div>
      <button
        className="toolbar-item spaced"
        aria-label="File Uploader"
        disabled={isDisabled}
        onClick={handleOnClick}
      >
        <i className="format upload" />
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        name="file-uploader"
        id="file-uploader"
        style={{
          display: "none",
        }}
        onChange={handleOnChange}
        disabled={isDisabled}
      />
    </div>
  );
};

export default UploadFileButton;
