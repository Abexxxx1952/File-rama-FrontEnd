import { publicAccessRole } from "./publicAccessRole";

export type FetchCreateFilePermissions = {
  fileId: string;
  role: publicAccessRole;
};
