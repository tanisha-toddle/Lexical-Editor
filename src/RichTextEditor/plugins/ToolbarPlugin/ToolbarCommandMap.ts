import { FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND, REDO_COMMAND, UNDO_COMMAND, type LexicalEditor } from "lexical";
import {
  RichTextOptions,
  type RichTextOption,
} from "../../../constants/toolbarOptions";

export const commandMap: Record<RichTextOption, (editor: LexicalEditor) => void> = {
  [RichTextOptions.Undo]: (editor) => {
    editor.dispatchCommand(UNDO_COMMAND,  undefined);
  },
  [RichTextOptions.Redo]: (editor) => {
    editor.dispatchCommand(REDO_COMMAND,  undefined);
  },
  [RichTextOptions.Bold]: (editor) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  },
  [RichTextOptions.Italic]: (editor) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  },
  [RichTextOptions.Underline]: (editor) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  },
  [RichTextOptions.Strikethrough]: (editor) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
  },
  [RichTextOptions.Superscript]: (editor) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
  },
  [RichTextOptions.Subscript]: (editor) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
  },
  [RichTextOptions.Highlight]: (editor) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
  },
  [RichTextOptions.Code]: (editor) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
  },
  [RichTextOptions.LeftAlign]: (editor) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
  },
  [RichTextOptions.CenterAlign]: (editor) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
  },
  [RichTextOptions.RightAlign]: (editor) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
  },
  [RichTextOptions.JustifyAlign]: (editor) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
  }
};
