import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {CacheModule, commonConfig, GatewayModule} from "@technerds/common-services";
import {ConfigModule} from "@nestjs/config";
import { UserModule } from './user/user.module';
import configuration from "./config/configuration";

@Module({
  imports: [
    CacheModule,
    GatewayModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration,commonConfig],
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
