export function getIconFromFileType(fileType: string): string {
  switch (fileType) {
    case "application/pdf":
      return "pdf-icon";

    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "word-icon";

    case "application/vnd.ms-excel":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return "excel-icon";

    case "application/zip":
    case "application/x-zip-compressed":
      return "zip-icon";

    case "text/plain":
      return "text-icon";

    default:
      if (fileType.startsWith("image/")) {
        return "image-icon";
      }

      if (fileType.startsWith("video/")) {
        return "video-icon";
      }

      if (fileType.startsWith("audio/")) {
        return "audio-icon";
      }

      return "file-icon";
  }
}

export function getFileSize(size: number): string {
  const sizeInMB = size / (1024 * 1024);

  if (sizeInMB >= 1) {
    return `${sizeInMB.toFixed(2)} MB`;
  }

  const sizeInKB = (sizeInMB * 1024).toFixed(2);
  return `${sizeInKB} KB`;
}
