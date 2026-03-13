export const RichTextOptions = {
  Undo: "undo",
  Redo: "redo",
  Bold: "bold",
  Italic: "italic",
  Underline: "underline",
  Strikethrough: "strikethrough",
  Superscript: "superscript",
  Subscript: "subscript",
  Highlight: "highlight",
  Code: "code",
  LeftAlign: "leftAlign",
  CenterAlign: "centerAlign",
  RightAlign: "rightAlign",
  JustifyAlign: "justifyAlign",
} as const;

export type RichTextOption =
  typeof RichTextOptions[keyof typeof RichTextOptions];