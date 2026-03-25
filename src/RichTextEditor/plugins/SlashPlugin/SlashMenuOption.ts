import { MenuOption } from "@lexical/react/LexicalTypeaheadMenuPlugin";
import type { SlashMenuItem } from "./types";

// LexicalTypeaheadMenuPlugin requires options to extend MenuOption.

export class SlashMenuOption extends MenuOption {
  item: SlashMenuItem;

  constructor(item: SlashMenuItem) {
    super(item.label);
    this.item = item;
  }
}
