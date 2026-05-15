import { afterEach, describe, expect, it, vi } from "vitest";
import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { fetchUpdateGoogleServiceAccounts } from "../../api/fetchUpdateGoogleServiceAccounts";
import { addGoogleServiceAccount } from ".././addGoogleServiceAccounts";
import { deleteGoogleServiceAccount } from ".././deleteGoogleServiceAccounts copy";
import { updateGoogleServiceAccount } from ".././updateGoogleServiceAccounts";
import { UpdateMode } from ".././types/user";

vi.mock("@/srcApp/features/cookies/model/getCookies", () => ({
  getCookies: vi.fn(),
}));

vi.mock("@/srcApp/features/auth/refresh-tokens/model/refreshTokens", () => ({
  refreshTokens: vi.fn(),
}));

vi.mock("@/srcApp/shared/model/notifyResponse", () => ({
  notifyResponse: vi.fn(),
}));

vi.mock("../../api/fetchUpdateGoogleServiceAccounts", () => ({
  fetchUpdateGoogleServiceAccounts: vi.fn(),
}));

const user = {
  id: "user-1",
  email: "ada@example.com",
  createdAt: new Date("2026-05-15T10:00:00.000Z"),
  payloads: [],
  googleServiceAccounts: [{ clientEmail: "drive@example.com" }],
  permissions: [],
  registrationSources: [],
  isVerified: true,
  isTwoFactorEnabled: false,
};

const serviceAccount = {
  clientEmail: "drive@example.com",
  rootFolderId: "root-folder",
  privateKey: "-----BEGIN PRIVATE KEY-----\nsecret\n-----END PRIVATE KEY-----",
};

describe("google service account actions", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when service account is added", () => {
    it("should update user with create mode and notify success", async () => {
      // Given
      const setUser = vi.fn();
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });
      vi.mocked(fetchUpdateGoogleServiceAccounts).mockResolvedValue(user);

      // When
      const result = await addGoogleServiceAccount(
        serviceAccount,
        vi.fn(),
        setUser,
      );

      // Then
      expect(fetchUpdateGoogleServiceAccounts).toHaveBeenCalledWith(
        "access-token",
        {
          googleServiceAccounts: [
            { ...serviceAccount, updateMode: UpdateMode.CREATE },
          ],
        },
      );
      expect(notifyResponse).toHaveBeenCalledWith({
        isError: false,
        successMessage:
          "Google service account drive@example.com added successfully",
      });
      expect(setUser).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe("when service account is updated", () => {
    it("should format private key, update user, and close modal", async () => {
      // Given
      const setUser = vi.fn();
      const setUpdateModalOpen = vi.fn();
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });
      vi.mocked(fetchUpdateGoogleServiceAccounts).mockResolvedValue(user);

      // When
      const result = await updateGoogleServiceAccount(
        serviceAccount,
        vi.fn(),
        setUser,
        setUpdateModalOpen,
      );

      // Then
      expect(fetchUpdateGoogleServiceAccounts).toHaveBeenCalledWith(
        "access-token",
        {
          googleServiceAccounts: [
            {
              ...serviceAccount,
              privateKey:
                "-----BEGIN PRIVATE KEY-----\\nsecret\\n-----END PRIVATE KEY-----",
              updateMode: UpdateMode.UPDATE,
            },
          ],
        },
      );
      expect(setUser).toHaveBeenCalledWith(user);
      expect(setUpdateModalOpen).toHaveBeenCalledWith(false);
      expect(result).toEqual(user);
    });
  });

  describe("when service account is deleted", () => {
    it("should update user with delete mode", async () => {
      // Given
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });
      vi.mocked(fetchUpdateGoogleServiceAccounts).mockResolvedValue(user);

      // When
      const result = await deleteGoogleServiceAccount(
        "drive@example.com",
        vi.fn(),
        vi.fn(),
      );

      // Then
      expect(fetchUpdateGoogleServiceAccounts).toHaveBeenCalledWith(
        "access-token",
        {
          googleServiceAccounts: [
            {
              clientEmail: "drive@example.com",
              updateMode: UpdateMode.DELETE,
            },
          ],
        },
      );
      expect(result).toEqual(user);
    });
  });

  describe("when only refresh token is available", () => {
    it("should refresh tokens and retry add action", async () => {
      // Given
      vi.mocked(getCookies)
        .mockResolvedValueOnce({
          access_token: undefined,
          refresh_token: "refresh-token",
        })
        .mockResolvedValueOnce({
          access_token: "new-access-token",
          refresh_token: "new-refresh-token",
        });
      vi.mocked(fetchUpdateGoogleServiceAccounts).mockResolvedValue(user);

      // When
      const result = await addGoogleServiceAccount(
        serviceAccount,
        vi.fn(),
        vi.fn(),
      );

      // Then
      expect(refreshTokens).toHaveBeenCalledWith("refresh-token");
      expect(fetchUpdateGoogleServiceAccounts).toHaveBeenCalledWith(
        "new-access-token",
        {
          googleServiceAccounts: [
            { ...serviceAccount, updateMode: UpdateMode.CREATE },
          ],
        },
      );
      expect(result).toEqual(user);
    });
  });

  describe("when service account update returns error data", () => {
    it("should notify error and return null", async () => {
      // Given
      const error = {
        message: "Drive account error",
        statusCode: 400,
        error: "Bad Request",
      };
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });
      vi.mocked(fetchUpdateGoogleServiceAccounts).mockResolvedValue(error);

      // When
      const result = await addGoogleServiceAccount(
        serviceAccount,
        vi.fn(),
        vi.fn(),
      );

      // Then
      expect(notifyResponse).toHaveBeenCalledWith({
        isError: true,
        responseResult: error,
      });
      expect(result).toBeNull();
    });
  });
});
