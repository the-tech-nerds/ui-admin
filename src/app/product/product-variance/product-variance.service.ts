import {GatewayService} from "@the-tech-nerds/common-services";
import {Injectable} from "@nestjs/common";
import MicroService from "../../constants/app-constants"
import {ApiResponseService} from "src/app/common/response/api-response.service";

@Injectable()
export class ProductVarianceService {
    constructor(
        private readonly gatewayService: GatewayService,
        private readonly responseService: ApiResponseService
    ) {
    }

    create(productVariance: any) {
        return this.gatewayService.execute(MicroService.Product, {
            method: "POST",
            path: '/api/v1/product/variance',
            body: productVariance,
        });
    }

    update(id: number, productVariance: any) {
        return this.gatewayService.execute(MicroService.Product, {
            method: "PUT",
            path: `/api/v1/product/variance/${id}`,
            body: productVariance,
        });
    }


    async listProductVariances(productId: number) {
        const {data: productVarianceList} = await this.gatewayService.execute(MicroService.Product, {
            method: "GET",
            path: `/api/v1/product/${productId}/variance/`,
        });
        const productVariances = productVarianceList.map((productVariance: any, index: any) => ({
            id: productVariance.id,
            'SL No': ++index,
            'Product': productVariance.product.name,
            'Variance Title': productVariance.title,
            'SKU': productVariance.sku,
            'Price': productVariance.price,
            'Unit': productVariance.unit ? productVariance.unit.name : 'n/a',
            'Unit Value': productVariance.unit_value || 'n/a',
            'Color': productVariance.color,
            'Status': productVariance.status ? 'Active' : 'Inactive'
        }));

        return this.responseService.response(productVariances);
    }

    async changeStatus(id: number) {
        const data = await this.gatewayService.execute(MicroService.Product, {
            method: "PUT",
            path: `/api/v1/product/variance/${id}/status`,
        });

        return this.responseService.response(data);
    }

    async get(productId: number) {
        const {data: product} = await this.gatewayService.execute(MicroService.Product, {
            method: "GET",
            path: `/api/v1/product/variance/${productId}`,
        });
        return this.responseService.response(product);
    }

    async delete(productId: number) {
        const res = await this.gatewayService.execute(MicroService.Product, {
            method: "DELETE",
            path: `/api/v1/product/variance/${productId}`,
        });
        return this.responseService.response(res);
    }
}
