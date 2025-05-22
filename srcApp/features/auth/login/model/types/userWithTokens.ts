import { User } from "@/srcApp/entities/user/model/types/user";

export type UserWithTokens = {
  data: User;
  access_token: string;
  refresh_token: string;
};
