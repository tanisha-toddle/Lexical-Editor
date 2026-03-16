import React, { useCallback } from "react";
import "./MediaCardComponent.css";
import type { UploadStatus } from "../../constants/types";
// import { getIconFromFileType } from "./utils/HelperFunctions";

interface MediaCardComponentProps {
  name: string;
  size: number;
  fileType: string;
  status: UploadStatus;
  url?: string;
}

const MediaCardComponent: React.FC<MediaCardComponentProps> = ({
  name,
  size,
  fileType,
  status,
  url,
}) => {
  const handleCardDoubleClick = useCallback(() => {
    if (url) window.open(url, "_blank");
  }, [url]);

  return (
    <div
      onDoubleClick={handleCardDoubleClick}
      className={`media-card-container ${status === "error" ? "error-border" : ""}`}
    >
      <div className="media-card-icon">
        <i className={`format pdf-icon`} />
      </div>

      <div className="media-card-content">
        <div className="media-card-title" title={name}>
          {name}
        </div>
        <div className="media-card-subtitle">{size} KB</div>
      </div>

      <div className="media-card-actions">
        {status === "error" && <i className="format error-icon" />}

        {status === "uploading" && <span className="loader" />}

        {status === "success" && <i className="format delete-icon" />}
      </div>
    </div>
  );
};

export default MediaCardComponent;
