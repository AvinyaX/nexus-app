import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./api/users/users.module";
import { HealthModule } from "./api/health/health.module";
import { AuthModule } from "./auth/auth.module";
import { PermissionsModule } from "./api/permissions/permissions.module";
import { RolesModule } from "./api/roles/roles.module";
import { CompaniesModule } from "./api/companies/companies.module";
import { ProductsModule } from "./api/products/products.module";
import { TestModule } from "./api/test/test.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    HealthModule,
    AuthModule,
    PermissionsModule,
    RolesModule,
    CompaniesModule,
    ProductsModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
