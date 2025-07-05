import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions as NestJwtSignOptions } from '@nestjs/jwt';
import {
  JwtSignOptions,
  JwtVerifyOptions,
  JwtDecodeOptions,
} from '@services/jwt';

export interface UserLoginDto {
  username: string;
  userId: string;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login(user: UserLoginDto) {
    const payload: { username: string; sub: string } = {
      username: user.username,
      sub: user.userId,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  sign(
    payload: string,
    options?: Omit<NestJwtSignOptions, keyof JwtSignOptions>,
  ): string;
  sign(payload: object | Buffer, options?: NestJwtSignOptions): string;
  sign(
    payload: string | object | Buffer,
    options?: NestJwtSignOptions,
  ): string {
    if (typeof payload === 'string') {
      return this.jwtService.sign(payload, options);
    }
    return this.jwtService.sign(payload, options);
  }

  decode(
    token: string,
    options?: JwtDecodeOptions,
  ): null | { [key: string]: unknown } | string {
    return this.jwtService.decode(token, options);
  }

  verify<T extends object | string = any>(
    token: string,
    options?: JwtVerifyOptions,
  ): T {
    return this.jwtService.verify(token, options) as T;
  }
}
