import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  type MenuRenderFn,
  type TriggerFn,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { type TextNode } from "lexical";
import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { MentionMenuOption } from "./MentionMenuOption";
import { $createMentionNode } from "./MentionNode";
import { MenuOptions } from "./MentionOptions";
import './styles.css';

const MentionPlugin = () => {

  const [editor] = useLexicalComposerContext();

  const [queryString, setQueryString] = useState<string | null>(null);

  const triggerFn: TriggerFn = useCallback((text: string) => {

    const match = /@([^/]*)$/.exec(text);

    if (match === null) return null;

    const query = match[1];

    // Allow up to 2 spaces in the query — closes menu on 3rd space
    // if ((query.match(/ /g) ?? []).length > 2) return null;

    return {
      leadOffset: match.index,
      matchingString: query,
      replaceableString: match[0],
    };
  }, []);

  const options = useMemo<MentionMenuOption[]>(() => {
    
    const query = queryString?.toLowerCase()?.trim() || "";

    return MenuOptions.filter((item) =>
      item.label.toLowerCase().includes(query),
    ).map((item) => new MentionMenuOption(item.label));

  }, [queryString]);

  const onSelectOption = useCallback(
    (
      selectedOption: MentionMenuOption,
      textNode: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        // remove the existing text node
        // nodeToRemove?.remove();

        // create a new node and insert at selection  ???
        const newNode = $createMentionNode(`@${selectedOption.label}`);
        // const dummyNode = $createTextNode(selectedOption.label);
        // dummyNode.setFormat("bold");
        newNode.setMode("token");
        textNode?.replace(newNode);
        newNode.selectEnd();
      });
      // close the menu
      closeMenu();
    },
    [editor],
  );

  const menuRenderFn: MenuRenderFn<MentionMenuOption> = useCallback(
    (
      anchorElementRef,
      { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
    ) => {
      if (!anchorElementRef.current || options.length === 0) return null;

      return createPortal(
        <div
          className="menu-container"
          role="listbox"
          aria-label="Slash command menu"
        >
          <ul className="menu-list">
            {options.map((option, index) => (
              <li
                key={option.key}
                className={`menu-item ${selectedIndex === index ? "active" : ""}`}
                onClick={() => {
                  setHighlightedIndex(index);
                  selectOptionAndCleanUp(option);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>,
        anchorElementRef.current,
      );
    },
    [options],
  );

  return (
    <LexicalTypeaheadMenuPlugin<MentionMenuOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      options={options}
      triggerFn={triggerFn}
      menuRenderFn={menuRenderFn}
    />
  );
};

export default MentionPlugin;
