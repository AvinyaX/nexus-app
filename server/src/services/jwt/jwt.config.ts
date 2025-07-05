import type { Algorithm } from 'jsonwebtoken';

export interface JwtConfig {
  secret: string;
  signOptions: { expiresIn: number; algorithm: Algorithm };
  verifyOptions: { algorithms: Algorithm[] };
}

export const jwtConfig: JwtConfig = {
  secret: process.env.JWT_SECRET || 'default_secret',
  signOptions: {
    expiresIn: 3600, // 1 hour in seconds
    algorithm: 'HS256',
  },
  verifyOptions: {
    algorithms: ['HS256'],
  },
};
