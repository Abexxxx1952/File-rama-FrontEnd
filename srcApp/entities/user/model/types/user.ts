import { File, Folder } from "@/srcApp/entities/fileSystemItem/model/types";
import { Stat } from "@/srcApp/entities/stats/model/types/stat";
import { UUID } from "crypto";

export type User = {
  id: UUID;
  name?: string;
  email: string;
  icon?: string;
  createdAt: Date;
  updatedAt?: Date;
  payloads: Payloads[];
  googleServiceAccounts: GoogleServiceAccountsResponse[];
  permissions: UsersPermissionsKeys[];
  registrationSources: RegistrationSources[];
  isVerified: boolean;
  isTwoFactorEnabled: boolean;
};

export type UserWithRelations = User & {
  files: File[];
  folders: Folder[];
  stats: Stat[];
};

export type Payloads = {
  key: string;
  value: string;
};

export type GoogleServiceAccountsResponse = {
  clientEmail: string;
  rootFolderId?: string;
};

export type GoogleServiceAccountsRequest = GoogleServiceAccountsResponse & {
  privateKey: string;
};

export type GoogleServiceAccountsOptionalRequest =
  GoogleServiceAccountsResponse & {
    privateKey?: string;
  };

type UsersPermissionsKeys = "CreateFile" | "DeleteFile";

enum RegistrationSources {
  Google = "Google",
  GitHub = "GitHub",
  Local = "Local",
}

export enum UpdateMode {
  CREATE = "Create",
  UPDATE = "Update",
  DELETE = "Delete",
}
