import React, { useCallback } from "react";
import "./MenuItem.css";
import type { SlashMenuOption } from "../../RichTextEditor/plugins/SlashPlugin/SlashMenuOption";

interface MenuItemProps {
  option: SlashMenuOption;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  option,
  isSelected,
  onClick,
  onMouseEnter,
}) => {
  const refCallback = useCallback(
    (el: HTMLLIElement | null) => {
      option.setRefElement(el);
    },
    [option],
  );
  return (
    <li
      key={option.key}
      ref={refCallback}
      aria-selected={isSelected}
      role="option"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className="menu-item"
      style={{
        backgroundColor: isSelected ? "#f0f0f0" : "transparent",
      }}
    >
      {/* Icon */}
      <span className="menu-item-icon">{option.item.icon}</span>
      {/* Label and description */}
      <span className="menu-item-content">
        <span className="menu-item-label">{option.item.label}</span>
        <span className="menu-item-description">{option.item.description}</span>
      </span>
    </li>
  );
};

export default MenuItem;
