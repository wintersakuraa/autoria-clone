import 'dotenv/config';

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

import { appConfig, swaggerConfig } from '@/configs';

import { GlobalExceptionFilter } from '@common/filters';
import { LoggingInterceptor, TransformInterceptor } from '@common/interceptors';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.setGlobalPrefix('api');

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe(appConfig.validationPipeOptions));
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(appConfig.port);
}

bootstrap();
