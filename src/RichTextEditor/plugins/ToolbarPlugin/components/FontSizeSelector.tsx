import {
  $forEachSelectedTextNode,
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection";
import { $getSelection, $isRangeSelection, type LexicalEditor } from "lexical";
import {
  DEFAULT_FONT_SIZE,
  MAX_ALLOWED_FONT_SIZE,
  MIN_ALLOWED_FONT_SIZE,
} from "../modules/ToolbarUtils";
import "./FontSizeSelector.css";

const clampFontSize = (value: number) =>
  Math.min(Math.max(value, MIN_ALLOWED_FONT_SIZE), MAX_ALLOWED_FONT_SIZE);

export default function FontSize({
  fontSize,
  editor,
  setFontSize,
}: {
  fontSize: number;
  editor: LexicalEditor;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
}) {

  const updateFontSize = () => {
    const newFontSize = clampFontSize(fontSize);

    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { "font-size": `${newFontSize}px` });
      }
    });

    setFontSize(newFontSize);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Escape") {
      e.preventDefault();
      updateFontSize();
    }
  };

  const handleButtons = (actionType: "inc" | "dec") => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {

        if (selection.isCollapsed()) {

          const currentSize = $getSelectionStyleValueForProperty(
            selection,
            "font-size",
            DEFAULT_FONT_SIZE.toString(),
          ).replace("px", "");

          const current =
            currentSize === "" ? DEFAULT_FONT_SIZE : Number(currentSize);

          const newFontSize = clampFontSize(
            actionType === "inc" ? current + 2 : current - 2,
          );

          $patchStyleText(selection, { "font-size": `${newFontSize}px` });
          return;
        }

        $forEachSelectedTextNode((textNode) => {
          const fontSize = textNode.getStyle().match(/font-size:\s*(\d+)px/);

          const currentSize = fontSize
            ? Number(fontSize[1])
            : DEFAULT_FONT_SIZE;

          const newFontSize = clampFontSize(
            actionType === "inc" ? currentSize + 2 : currentSize - 2,
          );

          textNode.setStyle(`font-size: ${newFontSize}px`);
        });
      }
    });
  };

  return (
    <>
      <button
        type="button"
        className="toolbar-item font-decrement"
        aria-label="Decrease font size"
        onClick={() => handleButtons("dec")}
        disabled={fontSize <= MIN_ALLOWED_FONT_SIZE && fontSize !== -1}
      >
        <i className="format minus-icon" />
      </button>

      <input
        type="number"
        aria-label="Font size"
        value={fontSize === -1 || fontSize === 0 ? "" : fontSize}
        className="toolbar-item font-size-input"
        min={MIN_ALLOWED_FONT_SIZE}
        max={MAX_ALLOWED_FONT_SIZE}
        onChange={(e) => setFontSize(Number(e.target.value))}
        onKeyDown={handleKeyDown}
        onBlur={() => updateFontSize()}
        name="font-size-selector"
      />

      <button
        type="button"
        className="toolbar-item font-increment"
        aria-label="Increase font size"
        onClick={() => handleButtons("inc")}
        disabled={fontSize >= MAX_ALLOWED_FONT_SIZE}
      >
        <i className="format add-icon" />
      </button>
    </>
  );
}
