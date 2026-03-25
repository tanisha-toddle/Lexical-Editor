import { $applyNodeReplacement, type LexicalNode } from "lexical";
import { MediaCardNode } from "./MediaCardNode";
import type { UploadStatus } from "../../constants/types";

export function $createMediaCardNode(
  name: string,
  size: number,
  fileType: string,
  status : UploadStatus,
  uploadId: string,
  url : string
): MediaCardNode {
  return $applyNodeReplacement(
    new MediaCardNode(
      name,
      size,
      fileType,
      status,
      uploadId,
      url,
      undefined
    ),
  );
}

export function $isMediaCardNode(
  node: LexicalNode | null | undefined,
): node is MediaCardNode {
  return node instanceof MediaCardNode;
}
