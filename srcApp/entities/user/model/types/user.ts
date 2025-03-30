import { File, Folder } from "@/srcApp/entities/fileSystemItem/model/types";
import { Stat } from "@/srcApp/entities/stats/model/types";
import { UUID } from "crypto";

export type User = {
  id: UUID;
  name?: string;
  email: string;
  icon?: string;
  createdAt: Date;
  updatedAt?: Date;
  payloads: Payloads[];
  googleServiceAccounts: GoogleServiceAccounts[];
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

type Payloads = {
  key: string;
  value: string;
};

type GoogleServiceAccounts = {
  clientEmail: string;
  rootFolderId: string;
};

type UsersPermissionsKeys = "CreateFile" | "DeleteFile";

enum RegistrationSources {
  Google = "Google",
  GitHub = "GitHub",
  Local = "Local",
}
