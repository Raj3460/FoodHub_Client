// src/types/role.types.ts

import { User as BetterAuthUser } from "better-auth";

export interface CustomUser extends BetterAuthUser {
  role: "CUSTOMER" | "PROVIDER" | "RIDER" | "ADMIN";
  phone?: string | null;
  status?: string | null;
}