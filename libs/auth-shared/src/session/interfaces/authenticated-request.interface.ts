import { Request } from 'express';
import { Token } from "./token.interface";

export interface AuthenticatedRequest extends Request {
  accessTokenData: Token
}