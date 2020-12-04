import { Module } from '@nestjs/common';
import {CacheModule, GatewayModule} from "@technerds/common-services";
import UserController from "./user.controller";
import UserService from "./user.service";

@Module({
  imports: [
    CacheModule,
    GatewayModule,
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
