import { UUID } from "crypto";
import { DriveInfoErrorResult } from "./driveInfoErrorResult";
import { DriveInfoSuccessResult } from "./driveInfoSuccessResult";

export type Stat = {
  id: UUID;
  userId: UUID;
  fileCount: number;
  folderCount: number;
  totalSize: number;
  usedSize: number;
  driveInfoResult: (DriveInfoSuccessResult | DriveInfoErrorResult)[];
};
