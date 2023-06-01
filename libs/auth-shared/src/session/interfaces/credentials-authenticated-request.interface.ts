import { Request } from "express";
import { User } from "@app/auth-shared/user/models/user.model";

export interface CredentialsAuthenticatedRequest extends Request {
  user: User
}