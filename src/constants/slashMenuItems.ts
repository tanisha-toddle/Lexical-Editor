import type { SlashMenuItem } from "../RichTextEditor/plugins/SlashPlugin/types";
import { $updateHeading } from "../utils/updateBlockType";

export const SLASH_MENU_ITEMS: SlashMenuItem[] = [
  {
    label: "Paragraph",
    type: "p",
    icon: "¶",
    description: "Plain text paragraph",
    onSelect: (_, option) => $updateHeading(option.item.type),
  },
  {
    label: "Heading 1",
    type: "h1",
    icon: "H1",
    description: "Large section heading",
    onSelect: (_, option) => $updateHeading(option.item.type),
  },
  {
    label: "Heading 2",
    type: "h2",
    icon: "H2",
    description: "Medium section heading",
    onSelect: (_, option) => $updateHeading(option.item.type),
  },
  {
    label: "Heading 3",
    type: "h3",
    icon: "H3",
    description: "Small section heading",
    onSelect: (_, option) => $updateHeading(option.item.type),
  },
];
