export interface ServerConfig {
  port: number;
  host: string;
}

export type AppConfig = {
  cors: { origin: (string | RegExp)[]; methods: string; credentials: boolean };
  rateLimit: { max: number; timeWindow: string };
  jwt: { secret: string };
  database: { url: string };
  redis: { host: string; port: number; password?: string; db: number };
  server: ServerConfig;
};

export const appConfig: AppConfig = {
  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
      : [
          "http://localhost:3000", 
          "http://localhost:5173",
          "https://localhost:3000",
          /\.preview\.emergentagent\.com$/,
          /\.preview\.emergent\.com$/
        ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  },
  rateLimit: {
    max: process.env.RATE_LIMIT_MAX ? Number(process.env.RATE_LIMIT_MAX) : 100,
    timeWindow: process.env.RATE_LIMIT_WINDOW || "1 minute",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your_jwt_secret_here",
  },
  database: {
    url: process.env.DATABASE_URL || "",
  },
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: process.env.REDIS_DB ? Number(process.env.REDIS_DB) : 0,
  },
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    host: process.env.HOST || "0.0.0.0",
  },
};
