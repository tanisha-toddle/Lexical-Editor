import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $nodesOfType,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_LOW,
  DROP_COMMAND,
  mergeRegister,
  PASTE_COMMAND,
} from "lexical";
import React, { useCallback, useEffect, useRef } from "react";
import {
  DELETE_MEDIA_CARD_COMMAND,
  INSERT_MEDIA_CARD_COMMAND,
  RETRY_MEDIA_UPLOAD_COMMAND,
} from "../../commands/MediaCardNodeCommands";
import type { UploadStatus } from "../../../constants/types";
import {
  $createMediaCardNode,
  $isMediaCardNode,
} from "../../../nodes/MediaCardNode/MediaCardNodeHelpers";
import { MediaCardNode } from "../../../nodes/MediaCardNode/MediaCardNode";

interface MediaUploadPluginProps {
  uploadMediaHandler: (file: File) => Promise<string>;
  deleteMediaHandler: (url: string) => Promise<void>;
}

const MediaUploadPlugin: React.FC<MediaUploadPluginProps> = ({
  uploadMediaHandler,
  deleteMediaHandler,
}) => {
  const [editor] = useLexicalComposerContext();

  // Temporary Storage : External prop as well
  const uploadResultsCache = useRef(
    new Map<
      string,
      {
        status: UploadStatus;
        file?: File;
        url?: string;
      }
    >(),
  );

  const updateAllInstances = useCallback(
    (uploadId: string, status: UploadStatus, url?: string) => {
      editor.update(
        () => {
          const allNodes = $nodesOfType(MediaCardNode);

          allNodes.forEach((node) => {
            if (node.getUploadId() === uploadId) {
              node.setStatus(status);
              if (url) node.setUrl(url);
            }
          });
        },
        {
          tag: "history-merge",
        },
      );
    },
    [editor],
  );

  useEffect(() => {
    mergeRegister(
      // 1 : INSERT MEDIA CARD NODE
      editor.registerCommand(
        INSERT_MEDIA_CARD_COMMAND,
        (files: File[]) => {
          // Add file cards to editor
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            files.forEach((file) => {
              // Generate a unique Id to store response and file in temp cache
              const uploadId = crypto.randomUUID();

              // Save file object to cache that can be accessed via upload id
              uploadResultsCache.current.set(uploadId, {
                status: "uploading",
                file: file,
              });

              // TD : pass status as well from here and remove file
              const node = $createMediaCardNode(
                file.name,
                file.size,
                file.type,
                "uploading",
                uploadId,
                "",
              );

              // Insert after parent node
              const anchorNode = selection.anchor.getNode();
              const parentNode = anchorNode.getTopLevelElementOrThrow();
              parentNode.insertAfter(node);

              // Insert a new para after the node if no sibling exits 
              const nextSibling = node.getNextSibling();
              if(!nextSibling){
                const newPara = $createParagraphNode();
                node.insertAfter(newPara);
                newPara.select();
              }

              // upload file to DB
              uploadMediaHandler(file)
                .then((url) => {
                  // as you recieve the url update the cache
                  const entry = uploadResultsCache.current.get(uploadId);

                  uploadResultsCache.current.set(uploadId, {
                    ...entry,
                    status: "success",
                    url,
                  });

                  // update all other nodes with same uploadId
                  updateAllInstances(uploadId, "success", url);
                })
                .catch(() => {
                  const entry = uploadResultsCache.current.get(uploadId);

                  uploadResultsCache.current.set(uploadId, {
                    ...entry,
                    status: "error",
                  });

                  // update all other nodes with same uploadId
                  updateAllInstances(uploadId, "error");
                });
            });
          });

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),

      // 2. PASTE COMMAND
      editor.registerCommand(
        PASTE_COMMAND,

        (event: ClipboardEvent) => {
          const files = Array.from(event.clipboardData?.files ?? []);

          if (files.length === 0) return false;

          editor.dispatchCommand(INSERT_MEDIA_CARD_COMMAND, files);

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),

      // 3. DROP COMMAND
      editor.registerCommand(
        DROP_COMMAND,

        (event: DragEvent) => {
          const files = Array.from(event.dataTransfer?.files || []);

          if (files.length === 0) return false;

          editor.dispatchCommand(INSERT_MEDIA_CARD_COMMAND, files);

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),

      // 4 : DELETE COMMAND
      editor.registerCommand(
        DELETE_MEDIA_CARD_COMMAND,
        (nodeKey: string) => {
          editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if (!node) return;

            const urlToDelete = $isMediaCardNode(node) ? node.getUrl() : null;
            node.remove();

            // Delete Url from DB if no node uses that url
            if (urlToDelete) {
              const remainingNodes = $nodesOfType(MediaCardNode);
              const urlIsUsed = remainingNodes.some(
                (n) => n.getUrl() === urlToDelete,
              );

              if (!urlIsUsed) {
                deleteMediaHandler(urlToDelete).catch(() =>
                  console.log("Cloud Deletion Failed !"),
                );
              }
            }
          });
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),

      // 5 : RETRY MEDIA UPLOAD COMMAND
      editor.registerCommand(
        RETRY_MEDIA_UPLOAD_COMMAND,
        (nodeKey: string) => {
          let uploadId: string = "";

          editor.read(() => {
            const node = $getNodeByKey(nodeKey);
            if (node && $isMediaCardNode(node)) {
              uploadId = node.getUploadId();
            }
          });

          if (!uploadId) return false;

          const cachedData = uploadResultsCache.current.get(uploadId);
          const file = cachedData?.file;

          if (!file) return false;

          updateAllInstances(uploadId, "uploading");

          uploadMediaHandler(file)
            .then((url) => {
              uploadResultsCache.current.set(uploadId, {
                ...cachedData,
                status: "success",
                url,
              });

              // update all other nodes with same uploadId
              updateAllInstances(uploadId, "success", url);
            })
            .catch(() => {
              uploadResultsCache.current.set(uploadId, {
                ...cachedData,
                status: "error",
              });

              // update all other nodes with same uploadId
              updateAllInstances(uploadId, "error");
            });

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),

      // 6 : MUTATION LISTENER
      editor.registerMutationListener(
        MediaCardNode,
        (nodeMutations, { updateTags }) => {
          if (updateTags.has("historic") || updateTags.has("paste")) {
            editor.update(
              () => {
                for (const [nodeKey, mutation] of nodeMutations) {
                  if (mutation === "created" || mutation === "updated") {
                    const node = $getNodeByKey(nodeKey);

                    if ($isMediaCardNode(node)) {
                      const uploadId = node.getUploadId();
                      const cachedData =
                        uploadResultsCache.current.get(uploadId);
                      
                      // cache is cleared on reload and if file does not exists show error state 
                      if (!cachedData && node.getStatus() === "uploading") {
                        node.setStatus("error");
                      }

                      if (
                        cachedData &&
                        node.getStatus() !== cachedData.status
                      ) {
                        node.setStatus(cachedData.status);

                        if (cachedData.url) {
                          node.setUrl(cachedData.url);
                        }
                      }
                    }
                  }
                }
              },
              {
                tag: "history-merge",
              },
            );
          }
        },
      ),
    );
  }, [editor, updateAllInstances, uploadMediaHandler, deleteMediaHandler]);

  return null;
};

export default MediaUploadPlugin;
