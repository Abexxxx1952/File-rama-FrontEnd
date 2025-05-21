import { GoogleServiceAccountsOptionalRequest, Payloads } from "./user";

export type userUpdateRequest = {
  name?: string;
  password?: string;
  icon?: string;
  payload?: Payloads[];
  googleServiceAccounts?: GoogleServiceAccountsOptionalRequest[];
  isTwoFactorEnabled?: boolean;
};
