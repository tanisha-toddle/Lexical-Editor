import { createCommand } from "lexical";

export const INSERT_MEDIA_CARD_COMMAND = createCommand<File[]>();

export const DELETE_MEDIA_CARD_COMMAND = createCommand<string>();

export const RETRY_MEDIA_UPLOAD_COMMAND = createCommand<string>();