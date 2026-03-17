import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_LOW,
  DROP_COMMAND,
  mergeRegister,
  PASTE_COMMAND,
} from "lexical";
import { useEffect } from "react";
import {
  $createMediaCardNode,
  $isMediaCardNode,
} from "../../../nodes/MediaCardNode/MediaCardNodeHelpers";
import {
  DELETE_MEDIA_CARD_COMMAND,
  INSERT_MEDIA_CARD_COMMAND,
} from "../../commands/MediaCardNodeCommands";

interface MediaUploadPluginProps {
  uploadMediaHandler: (file: File) => Promise<string>;
  deleteMediaHandler: (url: string) => Promise<void>;
}

const MediaUploadPlugin: React.FC<MediaUploadPluginProps> = ({
  uploadMediaHandler,
  deleteMediaHandler,
}) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(

      // Insert Media Card Node to editor and upload file to DB
      editor.registerCommand(
        INSERT_MEDIA_CARD_COMMAND,

        (files: File[]) => {
          editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
              files.forEach((file) => {
                // insert node
                const node = $createMediaCardNode(
                  file.name,
                  file.size,
                  file.type,
                );

                selection.insertNodes([node]);

                // upload to db
                uploadMediaHandler(file)
                  .then((url) => {
                    editor.update(() => {
                      node.setUrl(url);
                      node.setStatus("success");
                    });
                  })
                  .catch(() => {
                    editor.update(() => {
                      node.setStatus("error");
                    });
                  });
              });
            }
          });

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),

      // Copy Paste Detection
      editor.registerCommand(
        PASTE_COMMAND,

        (event: ClipboardEvent) => {
          console.log(event);
          const files = Array.from(event.clipboardData?.files ?? []);

          if (files.length === 0) return false;

          editor.dispatchCommand(INSERT_MEDIA_CARD_COMMAND, files);

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),

      // Drag and Drop Files
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

      // Delete media from editor and db
      editor.registerCommand(
        DELETE_MEDIA_CARD_COMMAND,

        (nodeKey: string) => {
          editor.update(() => {
            const node = $getNodeByKey(nodeKey);

            if (!node) return;

            node.remove();

            if ($isMediaCardNode(node) && node.__url) {
              deleteMediaHandler(node.__url).catch(() =>
                console.log("Deletion failed"),
              );
            }
          });

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  }, [editor, uploadMediaHandler, deleteMediaHandler]);

  return null;
};

export default MediaUploadPlugin;
