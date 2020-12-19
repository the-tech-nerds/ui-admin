import { Module } from '@nestjs/common';
import {CacheModule, GatewayModule} from "@technerds/common-services";
import PermissionCategoryController from "./permissionCategory.controller";
import PermissionCategoryService from "./permissionCategory.service";
import {ApiResponseService} from "../common/response/api-response.service";

@Module({
  imports: [
    CacheModule,
    GatewayModule,
  ],
  controllers: [PermissionCategoryController],
  providers: [PermissionCategoryService, ApiResponseService],
})
export class PermissionCategoryModule {}
