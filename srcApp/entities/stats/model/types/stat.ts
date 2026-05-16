import { type UUID } from "crypto";

import { type DriveInfoErrorResult } from "./driveInfoErrorResult";
import { type DriveInfoSuccessResult } from "./driveInfoSuccessResult";

export type Stat = {
  id: UUID;
  userId: UUID;
  fileCount: number;
  folderCount: number;
  totalSize: number;
  usedSize: number;
  driveInfoResult: (DriveInfoSuccessResult | DriveInfoErrorResult)[];
};
