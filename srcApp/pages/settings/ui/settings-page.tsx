"use client";

import { UserDelete } from "@/srcApp/entities/user/ui/user-delete/ui";
import { UserDriveUpdate } from "@/srcApp/entities/user/ui/user-drive-update";
import { UserInfo } from "@/srcApp/entities/user/ui/user-info";
import { EmailConfirmation } from "@/srcApp/features/auth/email-confirmation/ui";
import { TwoFactorAuth } from "@/srcApp/features/auth/two-factor/ui";
import { UserUpdate } from "./../../../entities/user/ui/user-update/index";
import styles from "./styles.module.css";

export function SettingsPage(props: any) {
  const user = {
    id: "813e0c7d-cd82-4ebc-8447-8d2a59d66f95",
    name: "John Doe",
    email: "fominelen73@gmail.com",
    icon: "https://example.com/icon.png",
    createdAt: "2025-01-06T16:49:00.756Z",
    updatedAt: "2025-01-13T00:16:25.935Z",
    payloads: [],
    googleServiceAccounts: [
      {
        privateKey:
          "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCSnKWGR98MkouZ\n2Qur+fzb88uyKOcdyWw6DYGGIjdYyOhQKT6+A6etCncEU4lWArpPfWOlGzUPorTC\nsOKYsrprRibbDyYePy24uSjO5ESprMw5rnhtV6RdhdLBlPQ6kFuEjeD/dN/6B5qb\n7DdIOW/NfuH5X+IV5XEj7STajK37pWjuOWkoPV7m/LScGh+LLPnBU9BI7Gt4s/Wm\nC2EEVGHE8vWW+aDu1jGwiBgOxI5ylo6l0+OM2/skutL/0QDZ+WgmE7wRDHSYfyHj\n0S5Bo+xeYLVOkm61+ywJCwRyTOEfstei5KekXl6xLvRvVRK+UBioN2oOd8T86G1c\nahN3q9N3AgMBAAECggEAAdufU1zMzE19HGV+Ot8vn5/uyGKxTxTS3Md4CTmcxvDA\n1Oc45tKICO7VhEYEuwTM1J4Lqbd3DCwtKzxvmqzFJP/eFS+TdZWqYClkhX6qChZo\n/iAiYYxXRmIgQhi/oZBbwInFvKcAAZygDnLHXpBvxMRjW7Ql2s4uCV0DdwuKVuKE\nUEqyDkQaOVYcR7DC0VdEN6vb7vj3DTc+PSbOEVpSpau2a0lL8wxe6Q88MyFb5xbV\nG8jS6TTZQ1uvr1yLUCfYCqXNTX6yO5GozaOk9jMPgQPp3ABDJ70HNW/rOWbUtNYw\nS+DvldJO1yJXKfcFh6uEbVbLXrv2azBsuf3No2RsgQKBgQDKBjk+sEBdKADIbsZd\nR0oFs24RgjHzXoXhUR13AeKJA9ffhcx9XyOzezaNe/s26MSymPg+X2TvBkL9IlEd\nDq5BL3t/mC4MdKdTEwQofbU/LZqBlBsw2MSr20Xh2eH3nsglg4EBdgxkn5VEUsW8\nsRdoK5TMug7q3FbcOPY3nZt69wKBgQC5yGcDfLencr5kJZu7c8sLzv3BmjfDuK7J\ndb6HyK6SUlV4tPGTCm92Nx+GdBkDjoZulgyYryhMohsKGTqiYkllYtaEgruoot/c\nmEDkhdBAWweW20G2Y41xZMDFGPCokNLrb53D2PfrIvXqlaTqQoimW+SD4/NcxxIh\n4wUA73fLgQKBgE/+UuBtra61TkoPAuCgf8DuIWExalHxVZW4JrCewHJ8YRgSxLvH\n1j0VRq6TLw+471nAlFsuLqsukYvl8LROwdTx1jbZrTIlZrPQTc8yp3fSuOEiIfof\nexCJjIw3V/BSoPGptoU7lwCo59Pb6owimyAWUZ8W9R0uDf65V1UCRTRVAoGAR8hA\n1T4ZD9/r5HILjBAfgf6GWYmmxj7Teg++gGRv3yVk1PDE7lV336tIyQCOsaseEhhz\n4YK8BXAVFn/NAfUL+tqHnEePDodwC6HgYOu7HUKO2iD5cOliO0/8k6shQWBDvqgv\nwv5QPFATyIHtaH4womabEsK+wzg/r0wyILxmAwECgYAL2j5fwb4Ps3qGszlZiIlR\n31crAyZPYp1+r9jJE7uo37FXoVk+PXWrQQVWwo62aptuWrwfvxowjeNF8ZvJbT54\nR30DoxhhWX3OsUsoCY1YNL2Py3htXgU0LeAAbpzyVzNXwdrAD4RFfSL+jo7IeaG6\nK4Qa5oZndu/Lz3s1LCzGGw==\n-----END PRIVATE KEY-----\n",
        clientEmail:
          "google-drive@fiery-booth-447215-n7.iam.gserviceaccount.com",
        rootFolderId: "1kM_yeDo1Ib3cWGWNRvugWsXeHGxuUS_F",
      },
    ],
    permissions: ["CreateFile", "DeleteFile"],
    registrationSources: ["Local"],
    isVerified: true,
    isTwoFactorEnabled: false,
  };

  console.log(props);

  return (
    <>
      <h1 className={styles.title}>Settings</h1>
      <UserInfo user={user} />
      <UserUpdate />
      <EmailConfirmation />
      <TwoFactorAuth isTwoFactorEnabled={user.isTwoFactorEnabled} />
      <UserDriveUpdate googleServiceAccounts={user.googleServiceAccounts} />
      <UserDelete />
    </>
  );
}
