import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { jwtConfig } from "@services/jwt";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: jwtConfig.signOptions,
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
