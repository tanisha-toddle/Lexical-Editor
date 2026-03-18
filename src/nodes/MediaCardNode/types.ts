import type { SerializedLexicalNode } from "lexical";
import type { UploadStatus } from "../../constants/types";

export type SerializedMediaCardNode = {
  type: "media-card";
  version: 1;
  name: string;
  size: number;
  fileType: string;
  url?: string;
  status: UploadStatus;
  uploadId: string;
} & SerializedLexicalNode;