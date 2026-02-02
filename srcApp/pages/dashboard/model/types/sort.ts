type SortOrder = "asc" | "desc";
type FileSystemSortKey =
  | "name"
  | "size"
  | "upload_date"
  | "read_access"
  | "write_access";

export type SortRule = {
  key: FileSystemSortKey;
  order?: SortOrder;
};
