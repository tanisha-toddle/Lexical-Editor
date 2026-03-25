import {
  $applyNodeReplacement,
  TextNode,
  type EditorConfig,
  type LexicalNode,
  type NodeKey,
  type SerializedTextNode,
} from "lexical";

export class MentionNode extends TextNode {
  constructor(text: string, key?: NodeKey) {
    super(text, key);
  }

  static getType(): string {
    return "mention";
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__text, node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    element.className = "editor-mention";
    return element;
  }

  updateDOM(): boolean {
    return false;
  }

  static importJSON(serializedNode: SerializedTextNode): MentionNode {
    return new MentionNode(serializedNode.text);
  }

  exportJSON(): SerializedTextNode {
    return {
      ...super.exportJSON(),
      type: "mention",
      version: 1,
    };
  }
}

export function $createMentionNode(text: string): MentionNode {
  return $applyNodeReplacement(new MentionNode(text));
}

export function $isMentionNode(
  node: LexicalNode | null | unknown,
): node is MentionNode {
  return node instanceof MentionNode;
}
