import { createContext } from "react";
import type { EditorModes } from "../RichTextEditor";

export const EditorContext = createContext<EditorModes>("edit");