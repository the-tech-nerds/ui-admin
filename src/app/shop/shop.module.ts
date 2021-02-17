import { Module } from '@nestjs/common';
import {CacheModule, GatewayModule} from "@the-tech-nerds/common-services";
import {ApiResponseService} from "../common/response/api-response.service";
import ShopController from './shop.controller';
import {ShopService} from './shop.service';

@Module({
    imports: [
        CacheModule,
        GatewayModule,
    ],
    controllers: [ShopController],
    providers: [ShopService, ApiResponseService]
})
export class ShopModule {}
