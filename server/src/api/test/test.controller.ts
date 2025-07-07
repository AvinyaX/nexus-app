import { Controller, Get } from '@nestjs/common';

@Controller('api/test')
export class TestController {
  @Get()
  test() {
    return { message: 'Hardware Store API is working!' };
  }
}