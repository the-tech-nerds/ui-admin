import { GatewayService } from "@the-tech-nerds/common-services";
import { Injectable } from "@nestjs/common";
import { ApiResponseService } from "../common/response/api-response.service";

@Injectable()
export default class DiscountService {
    constructor(
        private readonly gatewayService: GatewayService,
        private readonly responseService: ApiResponseService
    ) {
    }

    createDiscount(discount: any) {
        return this.gatewayService.execute("product", {
            method: "POST",
            path: '/api/v1/discount',
            body: discount,
        });
    }

    assign(discount: any) {
        return this.gatewayService.execute("product", {
            method: "POST",
            path: '/api/v1/discount/assign',
            body: discount,
        });
    }

    updateDiscount(id: number, discount: any) {
        return this.gatewayService.execute("product", {
            method: "PUT",
            path: `/api/v1/discount/${id}`,
            body: { ...discount },
        });
    }

    async listDiscounts() {
        const { data: discountList } = await this.gatewayService.execute("product", {
            method: "GET",
            path: '/api/v1/discount/all',
        });

        return this.responseService.response(discountList);
    }

    async getDiscount(discountId: number) {
        return this.gatewayService.execute("product", {
            method: "GET",
            path: `/api/v1/discount/${discountId}`,
        });
    }


    async changeStatus(discountId: number) {
        return this.gatewayService.execute("product", {
            method: "PUT",
            path: `/api/v1/discount/${discountId}/status`,
        });
    }
}
