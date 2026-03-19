import { type HeadingTagType } from "@lexical/rich-text";

export type BlockType = HeadingTagType | "p";

export type SlashMenuItem = {
  icon: string;
  label: string;
  description: string;
  type: BlockType;
};

