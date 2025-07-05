import { Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { jwtConfig } from "./jwt.config";
import {
  JwtSignOptions,
  JwtVerifyOptions,
  JwtDecodeOptions,
  JwtPayload,
  JwtDecoded,
} from "./jwt.types";

@Injectable()
export class JwtService {
  private readonly secret = jwtConfig.secret;
  private readonly signOptions = jwtConfig.signOptions;
  private readonly verifyOptions = jwtConfig.verifyOptions;

  sign(payload: JwtPayload, options?: JwtSignOptions): string {
    const mergedOptions = { ...this.signOptions, ...options };
    return jwt.sign(payload, this.secret, mergedOptions);
  }

  verify<T extends object | string = any>(
    token: string,
    options?: JwtVerifyOptions,
  ): T {
    const result = jwt.verify(token, this.secret, {
      ...this.verifyOptions,
      ...options,
    });
    return result as unknown as T;
  }

  decode(
    token: string,
    options?: JwtDecodeOptions,
  ): null | JwtPayload | JwtDecoded {
    return jwt.decode(token, options);
  }

  // Utility: get expiration date
  getExpiration(token: string): Date | null {
    const decoded = this.decode(token);
    let exp: number | undefined;
    if (decoded && typeof decoded === "object") {
      if ("exp" in decoded && typeof decoded.exp === "number") {
        exp = decoded.exp;
      } else if (
        "payload" in decoded &&
        typeof decoded.payload === "object" &&
        decoded.payload !== null &&
        "exp" in decoded.payload
      ) {
        const expVal = (decoded.payload as Record<string, unknown>).exp;
        if (typeof expVal === "number") {
          exp = expVal;
        }
      }
    }
    return exp ? new Date(exp * 1000) : null;
  }

  // Utility: get issued at date
  getIssuedAt(token: string): Date | null {
    const decoded = this.decode(token);
    let iat: number | undefined;
    if (decoded && typeof decoded === "object") {
      if ("iat" in decoded && typeof decoded.iat === "number") {
        iat = decoded.iat;
      } else if (
        "payload" in decoded &&
        typeof decoded.payload === "object" &&
        decoded.payload !== null &&
        "iat" in decoded.payload
      ) {
        const iatVal = (decoded.payload as Record<string, unknown>).iat;
        if (typeof iatVal === "number") {
          iat = iatVal;
        }
      }
    }
    return iat ? new Date(iat * 1000) : null;
  }

  // Utility: check if token is expired
  isExpired(token: string): boolean {
    const exp = this.getExpiration(token);
    return exp ? exp.getTime() < Date.now() : false;
  }
}
