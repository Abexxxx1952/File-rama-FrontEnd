import { DriveInfoErrorResult } from "./types/driveInfoErrorResult";

export function isDriveInfoErrorResult(
  driveInfo: unknown,
): driveInfo is DriveInfoErrorResult {
  return (
    typeof driveInfo === "object" &&
    driveInfo !== null &&
    "error" in driveInfo &&
    "errorMessage" in driveInfo
  );
}
