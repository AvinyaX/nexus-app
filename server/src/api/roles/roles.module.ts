import { Module } from "@nestjs/common";
import { RolesController } from "./roles.controller";
import { AclController } from "./roles.controller";
import { RolesService } from "./roles.service";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [RolesController, AclController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
