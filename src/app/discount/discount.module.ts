import {Module} from '@nestjs/common';
import {CacheModule, GatewayModule} from "@the-tech-nerds/common-services";
import DiscountController from "./discount.controller";
import DiscountService from "./discount.service";
import {ApiResponseService} from "../common/response/api-response.service";

@Module({
  imports: [
    CacheModule,
    GatewayModule,
  ],
  controllers: [DiscountController],
  providers: [DiscountService, ApiResponseService],
  exports:[DiscountService]
})
export class DiscountModule {}
