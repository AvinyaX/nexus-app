import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { User, CreateUserDto, UpdateUserDto } from "./users.types";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<User | null> {
    return await this.usersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string): Promise<User> {
    return await this.usersService.delete(id);
  }
}
