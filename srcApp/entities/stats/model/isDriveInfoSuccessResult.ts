import { DriveInfoSuccessResult } from "./types/driveInfoSuccessResult";

export function isDriveInfoSuccessResult(
  driveInfo: unknown,
): driveInfo is DriveInfoSuccessResult {
  return (
    typeof driveInfo === "object" &&
    driveInfo !== null &&
    "totalSpace" in driveInfo &&
    "usedSpace" in driveInfo &&
    "availableSpace" in driveInfo
  );
}
