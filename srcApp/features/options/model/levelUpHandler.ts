export function levelUpHandler(
  setPath: React.Dispatch<React.SetStateAction<string[]>>,
  setParentFolderId: React.Dispatch<React.SetStateAction<string[]>>,
) {
  setPath((prev) => {
    if (prev.length === 1) return prev;
    return prev.slice(0, prev.length - 1);
  });
  setParentFolderId((prev) => {
    if (prev.length === 0) return prev;
    return prev.slice(0, prev.length - 1);
  });
}
