import { useCallback, useEffect, useState } from "react";
import {
  RichTextOptions,
  type RichTextOption,
} from "../../../constants/toolbarOptions";
import { commandMap } from "./ToolbarCommandMap";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  mergeRegister,
  SELECTION_CHANGE_COMMAND,
  type RangeSelection,
} from "lexical";
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
  $setBlocksType,
} from "@lexical/selection";
import {
  $createHeadingNode,
  $isHeadingNode,
  type HeadingTagType,
} from "@lexical/rich-text";
import useKeyBindings from "./useKeyBindings";
import FontSizeSelector from "./components/FontSizeSelector";
import { DEFAULT_FONT_SIZE } from "./modules/ToolbarUtils";

export function Divider() {
  return <div className="divider"></div>;
}

const ToolbarPlugin = ({ isDisabled } : { isDisabled : boolean }) => {
  const [editor] = useLexicalComposerContext();

  const handleOnClick = (id: RichTextOption) => {
    commandMap[id]?.(editor);
  };

  const [disableMap, setDisableMap] = useState<Record<string, boolean>>({
    [RichTextOptions.Undo]: true,
    [RichTextOptions.Redo]: true,
  });

  const [selectionMap, setSelectionMap] = useState<Record<string, boolean>>({});

  // Font Size
  const [fontSize, setFontSize] = useState(16);

  const handleSelectedTextFontSize = useCallback(
    (selection: RangeSelection) => {
      const value = $getSelectionStyleValueForProperty(
        selection,
        "font-size",
        DEFAULT_FONT_SIZE.toString(),
      );

      if (value === "") {
        setFontSize(-1);
        return;
      }

      setFontSize(Number(value.replace("px", "")));
    },
    [],
  );

  // Block Type Selector
  const [blockType, setBlockType] = useState<HeadingTagType | "p">("p");

  const handleSelectedBlockType = (selection: RangeSelection) => {
    const anchorNode = selection.anchor.getNode();
    const element =
      anchorNode.getKey() === "root"
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow();

    if ($isHeadingNode(element)) {
      setBlockType(element.getTag());
    } else {
      setBlockType("p");
    }
  };

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const newSelectionMap = {
        [RichTextOptions.Bold]: selection.hasFormat("bold"),
        [RichTextOptions.Italic]: selection.hasFormat("italic"),
        [RichTextOptions.Underline]: selection.hasFormat("underline"),
        [RichTextOptions.Strikethrough]: selection.hasFormat("strikethrough"),
        [RichTextOptions.Subscript]: selection.hasFormat("subscript"),
        [RichTextOptions.Superscript]: selection.hasFormat("superscript"),
        [RichTextOptions.Highlight]: selection.hasFormat("highlight"),
        [RichTextOptions.Code]: selection.hasFormat("code"),
      };

      setSelectionMap(newSelectionMap);
      handleSelectedTextFontSize(selection);
      handleSelectedBlockType(selection);
    }
  }, [handleSelectedTextFontSize]);

  useKeyBindings({ onAction: handleOnClick });

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => $updateToolbar(), { editor });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setDisableMap((prev) => ({
            ...prev,
            [RichTextOptions.Undo]: !payload,
          }));
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setDisableMap((prev) => ({
            ...prev,
            [RichTextOptions.Redo]: !payload,
          }));
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, $updateToolbar]);

  const $updateHeading = (value: HeadingTagType | "p") => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        if (value === "p") {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createHeadingNode(value));
        }
        const newSelection = $getSelection();

        if ($isRangeSelection(newSelection)) {
          $patchStyleText(newSelection, {
            "font-size": null,
          });
        }
      }
    });
  };

  return (
    <div className="toolbar">
      <button
        aria-label="Undo"
        className="toolbar-item spaced"
        onClick={() => handleOnClick(RichTextOptions.Undo)}
        disabled={disableMap[RichTextOptions.Undo] || isDisabled}
      >
        <i className="format undo" />
      </button>

      <button
        aria-label="Redo"
        className="toolbar-item"
        onClick={() => handleOnClick(RichTextOptions.Redo)}
        disabled={disableMap[RichTextOptions.Redo] || isDisabled}
      >
        <i className="format redo" />
      </button>

      <Divider />

      <button
        aria-label="Bold"
        className={`toolbar-item spaced ${selectionMap[RichTextOptions.Bold] ? "active" : ""}`}
        onClick={() => handleOnClick(RichTextOptions.Bold)}
        disabled={isDisabled}
      >
        <i className="format bold" />
      </button>

      <button
        aria-label="Italic"
        className={`toolbar-item spaced ${selectionMap[RichTextOptions.Italic] ? "active" : ""}`}
        onClick={() => handleOnClick(RichTextOptions.Italic)}
        disabled={isDisabled}
      >
        <i className="format italic" />
      </button>

      <button
        aria-label="Underline"
        className={`toolbar-item spaced ${selectionMap[RichTextOptions.Underline] ? "active" : ""}`}
        onClick={() => handleOnClick(RichTextOptions.Underline)}
        disabled={isDisabled}
      >
        <i className="format underline" />
      </button>

      <button
        aria-label="Strikethrough"
        className={`toolbar-item ${selectionMap[RichTextOptions.Strikethrough] ? "active" : ""}`}
        onClick={() => handleOnClick(RichTextOptions.Strikethrough)}
        disabled={isDisabled}
      >
        <i className="format strikethrough" />
      </button>

      <Divider />

      <button
        aria-label="Superscript"
        className={`toolbar-item spaced ${selectionMap[RichTextOptions.Superscript] ? "active" : ""}`}
        onClick={() => handleOnClick(RichTextOptions.Superscript)}
        disabled={isDisabled}
      >
        <i className="format superscript" />
      </button>

      <button
        aria-label="Subscript"
        className={`toolbar-item spaced ${selectionMap[RichTextOptions.Subscript] ? "active" : ""}`}
        onClick={() => handleOnClick(RichTextOptions.Subscript)}
        disabled={isDisabled}
      >
        <i className="format subscript" />
      </button>

      <button
        aria-label="Highlight"
        className={`toolbar-item spaced ${selectionMap[RichTextOptions.Highlight] ? "active" : ""}`}
        onClick={() => handleOnClick(RichTextOptions.Highlight)}
        disabled={isDisabled}
      >
        <i className="format highlight" />
      </button>

      <button
        aria-label="Code"
        className={`toolbar-item ${selectionMap[RichTextOptions.Code] ? "active" : ""}`}
        onClick={() => handleOnClick(RichTextOptions.Code)}
        disabled={isDisabled}
      >
        <i className="format code" />
      </button>

      <Divider />

      <button
        aria-label="Left Align"
        className="toolbar-item"
        onClick={() => handleOnClick(RichTextOptions.LeftAlign)}
        disabled={isDisabled}
      >
        <i className="format left-align" />
      </button>

      <button
        aria-label="Center Align"
        className="toolbar-item"
        onClick={() => handleOnClick(RichTextOptions.CenterAlign)}
        disabled={isDisabled}
      >
        <i className="format center-align" />
      </button>

      <button
        aria-label="Right Align"
        className="toolbar-item"
        onClick={() => handleOnClick(RichTextOptions.RightAlign)}
        disabled={isDisabled}
      >
        <i className="format right-align" />
      </button>

      <button
        aria-label="Justify Align"
        className="toolbar-item"
        onClick={() => handleOnClick(RichTextOptions.JustifyAlign)}
        disabled={isDisabled}
      >
        <i className="format justify-align" />
      </button>

      <Divider />
      <select
        className="editor-heading-select"
        value={blockType}
        onChange={(e) => $updateHeading(e.target.value as HeadingTagType)}
        name="block-type-selector"
        disabled={isDisabled}
      >
        <option value="p">Normal Text</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>

      <Divider />

      <FontSizeSelector
        fontSize={fontSize}
        editor={editor}
        setFontSize={setFontSize}
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default ToolbarPlugin;
