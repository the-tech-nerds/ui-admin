import { Module } from '@nestjs/common';
import {CacheModule, GatewayModule} from "@the-tech-nerds/common-services";
import {ApiResponseService} from "../common/response/api-response.service";
import SupplierController from './supplier.controller';
import {SupplierService} from './supplier.service';

@Module({
    imports: [
        CacheModule,
        GatewayModule,
    ],
    controllers: [SupplierController],
    providers: [SupplierService, ApiResponseService]
})
export class SupplierModule {}
