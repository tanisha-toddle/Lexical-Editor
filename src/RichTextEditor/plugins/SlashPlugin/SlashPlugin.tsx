import {
  LexicalTypeaheadMenuPlugin,
  type MenuRenderFn,
  type TriggerFn,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { SlashMenuOption } from "./SlashMenuOption";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useMemo, useState } from "react";
import type { TextNode } from "lexical";
import { createPortal } from "react-dom";
import MenuItem from "../../../components/MenuItem/MenuItem";
import "./SlashPlugin.css";
import type { SlashMenuItem } from "./types";

interface SlashMenuProps {
  menuItems: SlashMenuItem[];
}

const SlashMenuPlugin: React.FC<SlashMenuProps> = ({ menuItems }) => {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);

  // Called when an option is selected ( click or enter )
  // Can place it outside editor.update based on use case 
  const onSelectOption = useCallback(
    (
      selectedOption: SlashMenuOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        nodeToRemove?.remove();
        selectedOption.item.onSelect(editor, selectedOption);
      });
      closeMenu();
    },
    [editor],
  );

  // List of Options filtered based on query string
  const options = useMemo<SlashMenuOption[]>(() => {
    const query = queryString?.toLowerCase()?.trim() || "";

    return menuItems
      .filter(
        (item) =>
          item.label.toLowerCase().includes(query) ||
          item.type.toLowerCase().includes(query),
      )
      .map((item) => new SlashMenuOption(item));
  }, [queryString, menuItems]);

  // Trigger function : slash triggers the plugin
  const triggerFn: TriggerFn = useCallback((text: string) => {
    const match = /\/([^/]*)$/.exec(text);
    if (match === null) return null;

    const query = match[1];
    // Allow up to 2 spaces in the query — closes menu on 3rd space
    if ((query.match(/ /g) ?? []).length > 2) return null;

    return {
      leadOffset: match.index,
      matchingString: query,
      replaceableString: match[0],
    };
  }, []);

  const menuRenderFn: MenuRenderFn<SlashMenuOption> = useCallback(
    (
      anchorElementRef,
      { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
    ) => {
      if (!anchorElementRef.current || options.length === 0) return null;

      return createPortal(
        <div
          className="slash-menu-container"
          role="listbox"
          aria-label="Slash command menu"
        >
          <ul className="slash-menu-list">
            {options.map((option, index) => (
              <MenuItem
                key={option.key}
                option={option}
                isSelected={selectedIndex === index}
                onClick={() => {
                  setHighlightedIndex(index);
                  selectOptionAndCleanUp(option);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              />
            ))}
          </ul>
        </div>,
        anchorElementRef.current,
      );
    },
    [options],
  );

  return (
    <LexicalTypeaheadMenuPlugin<SlashMenuOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      options={options}
      triggerFn={triggerFn}
      menuRenderFn={menuRenderFn}
    />
  );
};

export default SlashMenuPlugin;
