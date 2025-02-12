import { UUID } from "crypto";

type DriveInfoResult = {
  driveEmail: string;
  totalSpace: number;
  usedSpace: number;
  availableSpace: number;
};

export type Stat = {
  id: UUID;
  userId: UUID;
  fileCount: number;
  folderCount: number;
  totalSize: number;
  usedSize: number;
  driveInfoResult: DriveInfoResult[];
};
