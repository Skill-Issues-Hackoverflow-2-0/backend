import { z } from "zod";

export interface userType {
  email: string;
  name?: string;
  role?: string;
  phone: string;
  userID?: string;
  isVerified?: boolean;
  profileImg?: string;
  refreshToken?: string;
}

export const jwtPayloadSchema = z.object({
  data: z.string(),
  iat: z.number(),
  exp: z.number(),
  // Add other expected properties here
});
