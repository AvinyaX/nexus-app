import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { appConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Dynamically import helmet, rateLimit, and compress for compatibility
  const helmet = (await import('@fastify/helmet')).default;
  const rateLimit = (await import('@fastify/rate-limit')).default;
  const compress = (await import('@fastify/compress')).default;

  await app.register(helmet as unknown as Parameters<typeof app.register>[0]);
  await app.register(compress as unknown as Parameters<typeof app.register>[0]);
  await app.register(
    rateLimit as unknown as Parameters<typeof app.register>[0],
    appConfig.rateLimit,
  );

  app.enableCors(appConfig.cors);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have decorators
      forbidNonWhitelisted: true, // Throw error on unknown properties
      transform: true, // Auto-transform payloads to DTO instances
    }),
  );

  // Swagger config
  const configSwagger = new DocumentBuilder()
    .setTitle('Nexus API')
    .setDescription('API documentation for Nexus Server')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(appConfig.server.port, appConfig.server.host);
}

void bootstrap();
