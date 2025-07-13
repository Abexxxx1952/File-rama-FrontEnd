import { FetchUpdateFile } from "./fetchUpdateFile";
import { FetchUpdateFolder } from "./fetchUpdateFolder";

export type FetchUpdateMany = (FetchUpdateFile | FetchUpdateFolder)[];
