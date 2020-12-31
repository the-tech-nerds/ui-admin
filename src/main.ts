import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import {ConfigService} from "@nestjs/config"
import { AppModule } from './app/app.module';
import {LocalsMiddleware} from "./app/locals.middleware";
import * as hbs from 'hbs';
const bodyParser = require('body-parser');
import * as compression from 'compression';
import { ErrorFilter } from './app/filters/error.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
      AppModule,
  );

  app.use(compression());

  app.useStaticAssets(join(__dirname, '..', 'build'));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
  hbs.registerPartials(join(__dirname, '..', 'src/views/pages'));
  app.set('view options', { layout: 'index' });
  app.setViewEngine('hbs');
  app.enableCors();
  app.use(bodyParser.json());
  hbs.registerHelper('json', function (content: string) {
    return JSON.stringify(content);
  });

  const configService = app.get<ConfigService>(ConfigService);
  const cookieParser = require('cookie-parser');
  const cookieEncrypter = require('cookie-encrypter');
  const cookieSecret = configService.get('cookie_secret');
  app.use(cookieParser(cookieSecret));
  app.use(cookieEncrypter(cookieSecret));
  app.useGlobalFilters(new ErrorFilter());
  app.use(LocalsMiddleware);

  await app.listen(3001);
}
bootstrap();
