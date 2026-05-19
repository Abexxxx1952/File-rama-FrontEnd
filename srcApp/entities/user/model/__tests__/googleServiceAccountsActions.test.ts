import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";

import { addGoogleServiceAccount } from ".././addGoogleServiceAccounts";
import { deleteGoogleServiceAccount } from ".././deleteGoogleServiceAccounts";
import { UpdateMode } from ".././types/user";
import { updateGoogleServiceAccount } from ".././updateGoogleServiceAccount";

vi.mock("@/srcApp/shared/model/fetchWithAuth", () => ({
  fetchWithAuth: vi.fn(),
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
    it("should call fetchWithAuth and update user", async () => {
      // Given
      const setUser = vi.fn();
      vi.mocked(fetchWithAuth).mockResolvedValue(user);

      // When
      const result = await addGoogleServiceAccount(
        serviceAccount,
        vi.fn(),
        setUser
      );

      // Then
      expect(fetchWithAuth).toHaveBeenCalledWith(
        expect.any(Function),
        {
          googleServiceAccounts: [
            { ...serviceAccount, updateMode: UpdateMode.CREATE },
          ],
        },
        "Google service account drive@example.com added successfully",
        expect.any(Function)
      );
      expect(setUser).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe("when service account is updated", () => {
    it("should call fetchWithAuth, update user, and close modal", async () => {
      // Given
      const setUser = vi.fn();
      const setUpdateModalOpen = vi.fn();
      vi.mocked(fetchWithAuth).mockResolvedValue(user);

      // When
      const result = await updateGoogleServiceAccount(
        serviceAccount,
        vi.fn(),
        setUser,
        setUpdateModalOpen
      );

      // Then
      expect(fetchWithAuth).toHaveBeenCalledWith(
        expect.any(Function),
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
        "Google service account drive@example.com updated successfully",
        expect.any(Function)
      );
      expect(setUser).toHaveBeenCalledWith(user);
      expect(setUpdateModalOpen).toHaveBeenCalledWith(false);
      expect(result).toEqual(user);
    });
  });

  describe("when service account is deleted", () => {
    it("should call fetchWithAuth and update user", async () => {
      // Given
      const setUser = vi.fn();
      vi.mocked(fetchWithAuth).mockResolvedValue(user);

      // When
      const result = await deleteGoogleServiceAccount(
        "drive@example.com",
        vi.fn(),
        setUser
      );

      // Then
      expect(fetchWithAuth).toHaveBeenCalledWith(
        expect.any(Function),
        {
          googleServiceAccounts: [
            {
              clientEmail: "drive@example.com",
              updateMode: UpdateMode.DELETE,
            },
          ],
        },
        "Google service account drive@example.com deleted successfully",
        expect.any(Function)
      );
      expect(setUser).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe("when action fails", () => {
    it("should return null", async () => {
      // Given
      vi.mocked(fetchWithAuth).mockResolvedValue(null);

      // When
      const result = await addGoogleServiceAccount(
        serviceAccount,
        vi.fn(),
        vi.fn()
      );

      // Then
      expect(fetchWithAuth).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
