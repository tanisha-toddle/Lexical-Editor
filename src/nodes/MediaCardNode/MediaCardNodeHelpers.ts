import { $applyNodeReplacement, type LexicalNode } from "lexical";
import { MediaCardNode } from "./MediaCardNode";

export function $createMediaCardNode(
  name: string,
  size: number,
  fileType: string,
): MediaCardNode {
  return $applyNodeReplacement(
    new MediaCardNode(name, size, fileType, "uploading", ""),
  );
}

export function $isMediaCardNode(
  node: LexicalNode | null | undefined,
): node is MediaCardNode {
  return node instanceof MediaCardNode;
}
