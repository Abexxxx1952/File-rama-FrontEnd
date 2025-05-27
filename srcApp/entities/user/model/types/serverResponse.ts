import { File } from "@/srcApp/entities/fileSystemItem/model/types/file";
import { Folder } from "@/srcApp/entities/fileSystemItem/model/types/folder";
import { Stat } from "@/srcApp/entities/stats/model/types/stat";
import { User } from "./user";

export type ServerResponse = {
  users: User[];
  files: File[];
  folders: Folder[];
  stats: Stat[];
};
