import { type HeadingTagType } from "@lexical/rich-text";
import type { LexicalEditor } from "lexical";
import type { SlashMenuOption } from "./SlashMenuOption";

export type BlockType = HeadingTagType | "p";

export type SlashMenuItem = {
  icon: string;
  label: string;
  description: string;
  type: BlockType;
  onSelect : ( editor : LexicalEditor, option : SlashMenuOption) => void;
};

