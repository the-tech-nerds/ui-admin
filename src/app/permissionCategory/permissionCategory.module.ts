import { Module } from '@nestjs/common';
import {CacheModule, GatewayModule} from "@technerds/common-services";
import PermissionCategoryController from "./permissionCategory.controller";
import PermissionCategoryService from "./permissionCategory.service";

@Module({
  imports: [
    CacheModule,
    GatewayModule,
  ],
  controllers: [PermissionCategoryController],
  providers: [PermissionCategoryService],
})
export class PermissionCategoryModule {}
