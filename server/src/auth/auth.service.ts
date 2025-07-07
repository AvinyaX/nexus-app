import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService, JwtSignOptions as NestJwtSignOptions } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import {
  JwtSignOptions,
  JwtVerifyOptions,
  JwtDecodeOptions,
} from "@services/jwt";

export interface UserLoginDto {
  username: string;
  userId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async login(email: string, password: string) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        userPermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // In a real app, you would hash and compare passwords
    // For demo purposes, we'll accept "password" for all users
    if (password !== 'password') {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get the user's primary role
    const primaryRole = user.userRoles[0]?.role;

    const payload = {
      username: user.username,
      sub: user.id,
      email: user.email,
      role: primaryRole?.name,
    };

    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: primaryRole,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: userData,
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
    if (typeof payload === "string") {
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
