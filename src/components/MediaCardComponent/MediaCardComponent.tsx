import type { LexicalEditor, NodeKey } from "lexical";
import React, { useCallback } from "react";
import type { UploadStatus } from "../../constants/types";
import { DELETE_MEDIA_CARD_COMMAND, RETRY_MEDIA_UPLOAD_COMMAND } from "../../RichTextEditor/commands/MediaCardNodeCommands";
import "./MediaCardComponent.css";
import { getFileSize, getIconFromFileType } from "./utils/HelperFunctions";
// import { getIconFromFileType } from "./utils/HelperFunctions";

interface MediaCardComponentProps {
  editor: LexicalEditor;
  nodeKey: NodeKey;
  name: string;
  size: number;
  fileType: string;
  status: UploadStatus;
  url?: string;
}

const MediaCardComponent: React.FC<MediaCardComponentProps> = ({
  editor,
  nodeKey,
  name,
  size,
  fileType,
  status,
  url,
}) => {
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

      <div className="media-card-actions">
        {status === "error" && (
          <i className="format retry-icon" onClick={handleRetry} />
        )}

        {status === "uploading" && <span className="loader" />}

        {status !== "uploading" && (
          <i className="format delete-icon" onClick={handleDelete} />
        )}
      </div>
    </div>
  );
};

export default MediaCardComponent;
