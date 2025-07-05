import { Module, Global } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { redisConfig } from "./redis.config";

@Global()
@Module({
  providers: [RedisService, { provide: "REDIS_CONFIG", useValue: redisConfig }],
  exports: [RedisService],
})
export class RedisModule {}
