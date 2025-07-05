import { Injectable, OnModuleDestroy, Logger, Inject } from "@nestjs/common";
import Redis, { Redis as RedisClient, RedisOptions } from "ioredis";
import { RedisSearchOptions } from "./redis.types";

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly redis: RedisClient;
  private readonly pub: RedisClient;
  private readonly sub: RedisClient;

  constructor(@Inject("REDIS_CONFIG") private readonly config: RedisOptions) {
    this.redis = new Redis(this.config);
    this.pub = new Redis(this.config);
    this.sub = new Redis(this.config);

    this.redis.on("connect", () => this.logger.log("Redis connected"));
    this.redis.on("error", (err) =>
      this.logger.error(
        "Redis error",
        err instanceof Error ? err.stack : String(err),
      ),
    );
    this.pub.on("error", (err) =>
      this.logger.error(
        "Redis pub error",
        err instanceof Error ? err.stack : String(err),
      ),
    );
    this.sub.on("error", (err) =>
      this.logger.error(
        "Redis sub error",
        err instanceof Error ? err.stack : String(err),
      ),
    );
  }

  // CRUD
  async set(key: string, value: string): Promise<"OK"> {
    try {
      return await this.redis.set(key, value);
    } catch (err) {
      this.logger.error(
        `Error setting key ${key}`,
        err instanceof Error ? err.stack : String(err),
      );
      throw err;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.redis.get(key);
    } catch (err) {
      this.logger.error(
        `Error getting key ${key}`,
        err instanceof Error ? err.stack : String(err),
      );
      throw err;
    }
  }

  async del(key: string): Promise<number> {
    try {
      return await this.redis.del(key);
    } catch (err) {
      this.logger.error(
        `Error deleting key ${key}`,
        err instanceof Error ? err.stack : String(err),
      );
      throw err;
    }
  }

  async exists(key: string): Promise<number> {
    try {
      return await this.redis.exists(key);
    } catch (err) {
      this.logger.error(
        `Error checking existence of key ${key}`,
        err instanceof Error ? err.stack : String(err),
      );
      throw err;
    }
  }

  // Bulk
  async mset(data: Record<string, string>): Promise<"OK"> {
    try {
      const arr = Object.entries(data).flat();
      return await this.redis.mset(...arr);
    } catch (err) {
      this.logger.error(
        "Error in mset",
        err instanceof Error ? err.stack : String(err),
      );
      throw err;
    }
  }

  async mget(keys: string[]): Promise<(string | null)[]> {
    try {
      return await this.redis.mget(...keys);
    } catch (err) {
      this.logger.error(
        "Error in mget",
        err instanceof Error ? err.stack : String(err),
      );
      throw err;
    }
  }

  async mdel(keys: string[]): Promise<number> {
    try {
      return await this.redis.del(...keys);
    } catch (err) {
      this.logger.error(
        "Error in mdel",
        err instanceof Error ? err.stack : String(err),
      );
      throw err;
    }
  }

  // Search (by pattern)
  async search(options: RedisSearchOptions = {}): Promise<string[]> {
    const pattern = options.pattern || "*";
    const count = options.count || 100;
    let cursor = "0";
    let keys: string[] = [];
    try {
      do {
        const [next, found] = await this.redis.scan(
          cursor,
          "MATCH",
          pattern,
          "COUNT",
          count,
        );
        cursor = next;
        keys = keys.concat(found);
      } while (cursor !== "0");
      return keys;
    } catch (err) {
      this.logger.error(
        "Error in search",
        err instanceof Error ? err.stack : String(err),
      );
      throw err;
    }
  }

  // Pub/Sub
  async publish(channel: string, message: string): Promise<number> {
    try {
      return await this.pub.publish(channel, message);
    } catch (err) {
      this.logger.error(
        `Error publishing to channel ${channel}`,
        err instanceof Error ? err.stack : String(err),
      );
      throw err;
    }
  }

  subscribe(channel: string, listener: (msg: string) => void): void {
    void this.sub.subscribe(channel, (err, count) => {
      if (err) {
        this.logger.error(
          `Error subscribing to channel ${channel}`,
          err instanceof Error ? err.stack : String(err),
        );
      } else {
        this.logger.log(
          `Subscribed to channel ${channel} (${count as number} subscriptions)`,
        );
      }
    });
    this.sub.on("message", (chan, msg) => {
      if (chan === channel) listener(msg);
    });
  }

  async unsubscribe(channel: string): Promise<void> {
    try {
      await this.sub.unsubscribe(channel);
      this.logger.log(`Unsubscribed from channel ${channel}`);
    } catch (err) {
      this.logger.error(
        `Error unsubscribing from channel ${channel}`,
        err instanceof Error ? err.stack : String(err),
      );
      throw err;
    }
  }

  async onModuleDestroy() {
    await this.redis.quit();
    await this.pub.quit();
    await this.sub.quit();
    this.logger.log("Redis connections closed");
  }
}
