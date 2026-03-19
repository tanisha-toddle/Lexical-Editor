import { $createHeadingNode } from "@lexical/rich-text";
import { $patchStyleText, $setBlocksType } from "@lexical/selection";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
} from "lexical";
import type { BlockType } from "../RichTextEditor/plugins/SlashPlugin/types";

export function $updateHeading(value: BlockType): void {
  const selection = $getSelection();

  if ($isRangeSelection(selection)) {
    if (value === "p") {
      $setBlocksType(selection, () => $createParagraphNode());
    } else {
      $setBlocksType(selection, () => $createHeadingNode(value));
    }

    const newSelection = $getSelection();
    if ($isRangeSelection(newSelection)) {
      $patchStyleText(newSelection, { "font-size": null });
    }
  }
}
