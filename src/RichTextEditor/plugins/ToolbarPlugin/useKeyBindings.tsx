import { useEffect } from "react";
import {
  RichTextOptions,
  type RichTextOption,
} from "../../../constants/toolbarOptions";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_LOW, KEY_ENTER_COMMAND } from "lexical";

const useKeyBindings = ({
  onAction,
}: {
  onAction: (id: RichTextOption) => void;
}) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        if (event?.key === "B" && event?.ctrlKey) {
          onAction(RichTextOptions.Bold);
        } else if (event?.key === "I" && event?.ctrlKey) {
          onAction(RichTextOptions.Italic);
        } else if (event?.key === "U" && event?.ctrlKey) {
          onAction(RichTextOptions.Underline);
        } else if (event?.key === "Z" && event?.ctrlKey) {
          onAction(RichTextOptions.Undo);
        } else if (event?.key === "Y" && event?.ctrlKey) {
          onAction(RichTextOptions.Redo);
        }

        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [onAction, editor]);
};

export default useKeyBindings;
