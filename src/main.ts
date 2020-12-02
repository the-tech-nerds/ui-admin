import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app/app.module';
import {LocalsMiddleware} from "./app/locals.middleware";
import * as hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
      AppModule,
  );
  app.useStaticAssets(join(__dirname, '..', 'build'));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
  hbs.registerPartials(join(__dirname, '..', 'src/views/pages'));
  app.set('view options', { layout: 'index' });
  app.setViewEngine('hbs');
  app.use(LocalsMiddleware);

  hbs.registerHelper('json', function (content: string) {
    return JSON.stringify(content);
  });

  await app.listen(8102);
}
bootstrap();