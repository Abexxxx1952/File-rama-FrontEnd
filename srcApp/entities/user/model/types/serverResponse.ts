import { type File } from "@/srcApp/entities/fileSystemItem/model/types/file";
import { type Folder } from "@/srcApp/entities/fileSystemItem/model/types/folder";
import { type Stat } from "@/srcApp/entities/stats/model/types/stat";

import { type User } from "./user";

export type ServerResponse = {
  users: User[];
  files: File[];
  folders: Folder[];
  stats: Stat[];
};
