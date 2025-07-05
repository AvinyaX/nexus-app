import type {
  SignOptions,
  VerifyOptions,
  DecodeOptions,
  JwtPayload as JwtPayloadJWT,
} from "jsonwebtoken";

export type JwtSignOptions = SignOptions;
export type JwtVerifyOptions = VerifyOptions;
export type JwtDecodeOptions = DecodeOptions;
export type JwtPayload = JwtPayloadJWT | string;

export interface JwtDecoded {
  header?: object;
  payload: JwtPayload;
  signature?: string;
}
