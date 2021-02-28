import { Module } from '@nestjs/common';
import {CacheModule, GatewayModule} from "@the-tech-nerds/common-services";
import CategoryController from "./category.controller";
import CategoryService from "./category.service";
import {ApiResponseService} from "../common/response/api-response.service";

@Module({
  imports: [
    CacheModule,
    GatewayModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService, ApiResponseService],
  exports:[CategoryService]
})
export class CategoryModule {}
