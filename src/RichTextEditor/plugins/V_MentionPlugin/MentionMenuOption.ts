import { MenuOption } from "@lexical/react/LexicalTypeaheadMenuPlugin";

export class MentionMenuOption extends MenuOption {
  label : string;

  constructor(label : string) {
    super(label);
    this.label = label;
  }
}
