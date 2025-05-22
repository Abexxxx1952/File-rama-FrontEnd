import { ErrorData } from "@/srcApp/shared/model/types/types";
import { User } from "./types/user";

export function isUserFromServer(user: User | null | ErrorData): user is User {
  return (
    typeof user === "object" && user !== null && "id" in user && "email" in user
  );
}
