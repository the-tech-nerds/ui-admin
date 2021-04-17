import { Module } from '@nestjs/common';
import {CacheModule, GatewayModule} from "@the-tech-nerds/common-services";
import {ApiResponseService} from "../common/response/api-response.service";
import BrandController from './brand/brand.controller';
import { BrandService } from './brand/brand.service';
import UnitController from './unit/unit.controller';
import { UnitService } from './unit/unit.service';
import ProductController from "./product/product.controller";
import {ProductService} from "./product/product.service";
import ProductVarianceController from "./product-variance/product-variance.controller";
import {ProductVarianceService} from "./product-variance/product-variance.service";
import InventoryController from "./inventory/inventory.controller";
import {InventoryService} from "./inventory/inventory.service";

@Module({
    imports: [
        CacheModule,
        GatewayModule,
    ],
    controllers: [ProductController, InventoryController, ProductVarianceController, UnitController, BrandController],
    providers: [ProductService, InventoryService, ProductVarianceService, UnitService, BrandService, ApiResponseService]
})
export class ProductModule {}
