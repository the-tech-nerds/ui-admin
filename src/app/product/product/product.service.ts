import {GatewayService} from "@the-tech-nerds/common-services";
import {Injectable} from "@nestjs/common";
import MicroService from "../../constants/app-constants"
import { ApiResponseService } from "src/app/common/response/api-response.service";

@Injectable()
export class ProductService {
    constructor(
        private readonly gatewayService: GatewayService,
        private readonly responseService: ApiResponseService
    ) {
    }

    create(product: any) {
        return this.gatewayService.execute(MicroService.Product, {
            method: "POST",
            path: '/api/v1/product',
            body: product,
        });
    }

    update(id: number, product: any) {
        return this.gatewayService.execute(MicroService.Product, {
            method: "PUT",
            path: `/api/v1/product/${id}`,
            body: product,
        });
    }


    async listProducts() {
        const {data: productList} = await this.gatewayService.execute(MicroService.Product, {
            method: "GET",
            path: '/api/v1/product',
        });
        const products = productList.map((product: any, index: any) => ({
            id: product.id,
            'SL No': ++index,
            'Brand': product.brand?.name,
            'Name': product.name,
            'Status': product.status ? 'Active' : 'Inactive'
        }));
        return this.responseService.response(products);
    }



    async get(productId: number) {
        const {data: product} = await this.gatewayService.execute(MicroService.Product, {
            method: "GET",
            path: `/api/v1/product/${productId}`,
        });
        return this.responseService.response(product);
    }

    async delete(productId: number) {
        const res= await this.gatewayService.execute(MicroService.Product, {
            method: "DELETE",
            path: `/api/v1/product/${productId}`,
        });
        return this.responseService.response(res);
    }
}
