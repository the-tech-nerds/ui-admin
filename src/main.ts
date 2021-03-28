import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import {ConfigService} from "@nestjs/config"
import { AppModule } from './app/app.module';
import {LocalsMiddleware} from "./app/locals.middleware";
import * as hbs from 'hbs';
import * as compression from 'compression';
import { ErrorFilter } from './app/filters/error.filter';
import {JwtService} from "@nestjs/jwt";
import { PermissionTypes } from '@the-tech-nerds/common-services';
const rateLimit = require("express-rate-limit");
const bodyParser = require('body-parser');
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
  const jwtService = new JwtService({
    secret: configService.get('jwt_secret'),
  });

  app.use(function (req: any, res: any, next: any) {
    if (req.signedCookies && req.signedCookies.r_code) {
      res.parsedJWT = jwtService.decode(req.signedCookies.r_code);
    }
    res.permissionTypes = PermissionTypes;
    next();
  })

  app.use(LocalsMiddleware);
  app.use(
      rateLimit({
        windowMs: configService.get('api_rate_limit_time') * 60 * 1000, // 15 minutes
        max: configService.get('api_rate_limit_max'), // limit each IP to 100 requests per windowMs
      }),
  );
  await app.listen(3001);
}
bootstrap();
