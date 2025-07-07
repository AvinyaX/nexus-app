import { Controller, Post, Body, HttpException, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() loginDto: { email: string; password: string }) {
    try {
      const result = await this.authService.login(loginDto.email, loginDto.password);
      return result;
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
