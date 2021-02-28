import { Module } from '@nestjs/common';
import {CacheModule, GatewayModule} from "@the-tech-nerds/common-services";
import {ApiResponseService} from "../common/response/api-response.service";
import BrandController from './brand/brand.controller';
import { BrandService } from './brand/brand.service';
import UnitController from './unit/unit.controller';
import { UnitService } from './unit/unit.service';

@Module({
    imports: [
        CacheModule,
        GatewayModule,
    ],
    controllers: [UnitController,BrandController],
    providers: [UnitService, ApiResponseService, BrandService]
})
export class ProductModule {}
