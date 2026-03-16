export function getIconFromFileType(fileType: string): string {
  switch (fileType) {
    case "application/pdf":
      return "bi bi-file-earmark-pdf";

    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "bi bi-file-earmark-word";

    case "application/vnd.ms-excel":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return "bi bi-file-earmark-excel";

    case "application/zip":
    case "application/x-zip-compressed":
      return "bi bi-file-earmark-zip";

    case "text/plain":
      return "bi bi-file-earmark-text";

    default:
      if (fileType.startsWith("image/")) {
        return "bi bi-file-earmark-image";
      }

      if (fileType.startsWith("video/")) {
        return "bi bi-file-earmark-play";
      }

      if (fileType.startsWith("audio/")) {
        return "bi bi-file-earmark-music";
      }

      return "bi bi-file-earmark";
  }
}
