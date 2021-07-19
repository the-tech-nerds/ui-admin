import { GatewayService } from "@the-tech-nerds/common-services";
import { Injectable } from "@nestjs/common";
import { ApiResponseService } from "../common/response/api-response.service";
import * as moment from "moment";

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

        const discounts = discountList.map((discount: any, index: any) => ({
            id: discount.id,
            'SL No': ++index,
            'Name': discount.name,
            'Amount': discount.discount_amount,
            'Percentage': discount.discount_percentage,
            'Start Date': moment(discount.start_date).format('YYYY-MM-DD HH:mm'),
            'End Date': moment(discount.end_date).format('YYYY-MM-DD HH:mm'),
            'Status': discount.status ? 'Active' : 'Inactive',
            'Assignment': discount.is_assigned ? 'Assigned' : 'Not Assigned',
            'categories': discount.categories,
            'products': discount.products,
            'productVariances': discount.productVariances,
            'offers': discount.offers,
        }));

        return this.responseService.response(discounts);
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
