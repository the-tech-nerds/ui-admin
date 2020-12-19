import { Module } from '@nestjs/common';
import {CacheModule, GatewayModule} from "@technerds/common-services";
import RoleController from "./role.controller";
import RoleService from "./role.service";
import {ApiResponseService} from "../common/response/api-response.service";

@Module({
  imports: [
    CacheModule,
    GatewayModule,
  ],
  controllers: [RoleController],
  providers: [RoleService, ApiResponseService]
})
export class RoleModule {}
