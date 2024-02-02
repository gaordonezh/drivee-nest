import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import mongoose from 'mongoose';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({ origin: true });

  const config = app.get<ConfigService>(ConfigService);

  app.setGlobalPrefix(config.get('APP_PREFIX'));
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableShutdownHooks();

  await app.listen(config.get('APP_PORT'), '0.0.0.0', () =>
    console.log(
      `service ${config.get('npm_package_name')} is listening on port ${config.get(
        'APP_PORT',
      )} with prefix path '${config.get('APP_PREFIX')}' in the environment ${config.get('NODE_ENV')} 🚀`,
      'AppStart',
    ),
  );

  process.on('SIGTERM', async () => {
    console.debug('SIGTERM signal received.');
    console.log('Closing http server.');
    await new Promise((resolve) => setTimeout(resolve, 15000));
    await app.close();
    console.log('Http server closed.');

    mongoose.connection.close(false);
  });
}

bootstrap();
