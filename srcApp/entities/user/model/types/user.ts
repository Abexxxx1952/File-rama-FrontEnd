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
