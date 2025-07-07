export interface ServerConfig {
  port: number;
  host: string;
}

export type AppConfig = {
  cors: { 
    origin: (origin: string | undefined, callback: (err: Error | null, success?: boolean) => void) => void;
    methods: string; 
    credentials: boolean;
    allowedHeaders: string[];
  };
  rateLimit: { max: number; timeWindow: string };
  jwt: { secret: string };
  database: { url: string };
  redis: { host: string; port: number; password?: string; db: number };
  server: ServerConfig;
};

export const appConfig: AppConfig = {
  cors: {
    origin: (origin, callback) => {
      // Allow all preview domains and localhost
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5173', 
        'https://localhost:3000'
      ];
      
      // Allow all preview.emergentagent.com subdomains
      if (!origin || 
          allowedOrigins.includes(origin) || 
          origin.includes('.preview.emergentagent.com') ||
          origin.includes('.preview.emergent.com')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-company-id'],
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
