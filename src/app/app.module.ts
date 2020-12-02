import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {commonConfig, GatewayModule} from "@technerds/common-services";
import {ConfigModule} from "@nestjs/config";
import configuration from "./config/configuration";

@Module({
  imports: [
    // CacheModule,
    GatewayModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration,commonConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
