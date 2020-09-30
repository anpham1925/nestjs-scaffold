import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';
import { LanguageModule } from './common/modules/languagues/language.module';
import { LogModule } from './common/modules/custom-logs/log.module';
import { LogService } from './common/modules/custom-logs/log.service';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import { AuthenticationGuard } from './common/guards/authentication.guard';
import { FormatResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(helmet());

  const configService = app.get(ConfigService);
  const port = configService.get('APP_PORT');

  const corsOptions: CorsOptions = {
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    exposedHeaders: '*',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };

  app.enableCors(corsOptions);

  const options = new DocumentBuilder()
    .setTitle('Tada-Truck APIs')
    .setDescription('Detail of Tada-Truck APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    include: [LanguageModule],
  });
  SwaggerModule.setup('api/swagger', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
      skipNullProperties: true,
      skipUndefinedProperties: true,
      skipMissingProperties: true,
      transform: true,
    }),
  );

  app.use('/images', express.static(join(__dirname, 'images')));
  app.use('/audios', express.static(join(__dirname, 'audios')));
  app.use('/pdf', express.static(join(__dirname, 'pdf')));

  const logService = app.select(LogModule).get(LogService);

  app.useGlobalFilters(new AllExceptionsFilter(logService));

  app.useGlobalGuards(new AuthenticationGuard(new Reflector()));

  app.useGlobalInterceptors(new FormatResponseInterceptor());

  await app.listen(port, '0.0.0.0');

  console.log(`api app is working on port: ${port}`);
}
bootstrap();
