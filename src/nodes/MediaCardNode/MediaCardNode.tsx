import { DecoratorNode, type NodeKey } from "lexical";
import type { JSX } from "react";
import MediaCardComponent from "../../components/MediaCardComponent/MediaCardComponent";
import type { UploadStatus } from "../../constants/types";
import type { SerializedMediaCardNode } from "./types";

export class MediaCardNode extends DecoratorNode<JSX.Element> {
  __name: string;
  __size: number;
  __fileType: string;
  __url?: string;
  __status: UploadStatus;
  __uploadId: string;

  constructor(
    name: string,
    size: number,
    fileType: string,
    status: UploadStatus,
    uploadId: string,
    url?: string,
    key?: NodeKey,
  ) {
    super(key);
    this.__name = name;
    this.__size = size;
    this.__fileType = fileType;
    this.__status = status;
    this.__url = url;
    this.__uploadId = uploadId;
  }

  static getType(): string {
    return "media-card";
  }

  static clone(node: MediaCardNode): MediaCardNode {
    return new MediaCardNode(
      node.__name,
      node.__size,
      node.__fileType,
      node.__status,
      node.__uploadId,
      node.__url,
      node.__key,
    );
  }

  createDOM(): HTMLElement {
    return document.createElement("div");
  }

  updateDOM(): boolean {
    return false;
  }

  decorate(): JSX.Element {
    const self = this.getLatest();
    return (
      <MediaCardComponent
        nodeKey={this.getKey()}
        name={self.__name}
        size={self.__size}
        fileType={self.__fileType}
        status={self.__status}
        url={self.__url}
      />
    );
  }

  getUrl(): string | undefined {
    const latest = this.getLatest();
    return latest.__url;
  }

  setUrl(url: string) {
    const writable = this.getWritable();
    writable.__url = url;
  }

  getStatus(): UploadStatus {
    const latest = this.getLatest();
    return latest.__status;
  }

  setStatus(status: UploadStatus) {
    const writable = this.getWritable();
    writable.__status = status;
  }

  getUploadId(): string {
    return this.getLatest().__uploadId;
  }

  exportJSON(): SerializedMediaCardNode {
    return {
      type: "media-card",
      version: 1,
      name: this.__name,
      size: this.__size,
      fileType: this.__fileType,
      url: this.__url,
      status: this.__status,
      uploadId: this.__uploadId,
    };
  }

  static importJSON(_serializedNode: SerializedMediaCardNode): MediaCardNode {
    return new MediaCardNode(
      _serializedNode.name,
      _serializedNode.size,
      _serializedNode.fileType,
      _serializedNode.status,
      _serializedNode.uploadId || crypto.randomUUID(),
      _serializedNode.url,
    );
  }
}
