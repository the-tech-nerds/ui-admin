import { Module } from '@nestjs/common';
import {CacheModule, GatewayModule} from "@technerds/common-services";
import UserController from "./user.controller";
import UserService from "./user.service";
import {ApiResponseService} from "../common/response/api-response.service";

@Module({
  imports: [
    CacheModule,
    GatewayModule,
  ],
  controllers: [UserController],
  providers: [UserService, ApiResponseService]
})
export class UserModule {}
