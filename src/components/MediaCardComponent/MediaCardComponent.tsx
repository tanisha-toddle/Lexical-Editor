import type { NodeKey } from "lexical";
import React, { useCallback, useContext } from "react";
import type { UploadStatus } from "../../constants/types";
import {
  DELETE_MEDIA_CARD_COMMAND,
  RETRY_MEDIA_UPLOAD_COMMAND,
} from "../../RichTextEditor/commands/MediaCardNodeCommands";
import "./MediaCardComponent.css";
import { getFileSize, getIconFromFileType } from "./utils/HelperFunctions";
import { EditorContext } from "../../RichTextEditor/context/EditorContext";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import { getIconFromFileType } from "./utils/HelperFunctions";

interface MediaCardComponentProps {
  nodeKey: NodeKey;
  name: string;
  size: number;
  fileType: string;
  status: UploadStatus;
  url?: string;
}

const MediaCardComponent: React.FC<MediaCardComponentProps> = ({
  nodeKey,
  name,
  size,
  fileType,
  status,
  url,
}) => {
  
  const [editor] = useLexicalComposerContext();
  const mode = useContext(EditorContext);

  const handleCardDoubleClick = useCallback(() => {
    if (url) window.open(url, "_blank");
  }, [url]);

  const handleDelete = useCallback(() => {
    editor.dispatchCommand(DELETE_MEDIA_CARD_COMMAND, nodeKey);
  }, [editor, nodeKey]);

  const handleRetry = useCallback(() => {
    editor.dispatchCommand(RETRY_MEDIA_UPLOAD_COMMAND, nodeKey);
  }, [editor, nodeKey]);

  return (
    <div
      onDoubleClick={handleCardDoubleClick}
      className={`media-card-container ${status === "error" ? "error" : ""}`}
    >
      <div className="media-card-icon">
        <i className={`format ${getIconFromFileType(fileType)}`} />
      </div>

      <div className="media-card-content">
        <div className="media-card-title" title={name}>
          {name}
        </div>
        <div className="media-card-subtitle">{getFileSize(size)}</div>
      </div>

      {mode !== "read" && (
        <div className="media-card-actions">
          {status === "error" && (
            <button
              disabled={mode === "view"}
              onClick={handleRetry}
              aria-label="retry-upload"
              className="media-card-retry-button"
            >
              <i className="format retry-icon" />
            </button>
          )}

          {status === "uploading" && <span className="loader" />}

          {status !== "uploading" && (
            <button
              disabled={mode === "view"}
              onClick={handleDelete}
              aria-label="delete-media"
              className="media-card-delete-button"
            >
              <i className="format delete-icon" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaCardComponent;
