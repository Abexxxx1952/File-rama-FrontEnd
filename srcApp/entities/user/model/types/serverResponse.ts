import { File, Folder } from "@/srcApp/entities/fileSystemItem/model/types";
import { Stat } from "@/srcApp/entities/stats/model/types";
import { User } from "./user";

export type serverResponse = {
  users: User[];
  files: File[];
  folders: Folder[];
  stats: Stat[];
};
