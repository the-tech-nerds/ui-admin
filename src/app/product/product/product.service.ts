import {GatewayService} from "@the-tech-nerds/common-services";
import {Injectable} from "@nestjs/common";
import MicroService from "../../constants/app-constants"
import {ApiResponseService} from "src/app/common/response/api-response.service";

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
            'SL No': product.id,
            'Category': product?.categories?.reduce((categories: any, category: any) => (categories + category.name + ', '), '').slice(0, -2) || 'n/a',
            'Shop': product.shop ? product.shop.name : 'n/a',
            'Supplier': product.supplier ? product.supplier.name : 'n/a',
            'Brand': product.brand ? product.brand.name : 'n/a',
            'Name': product.name,
            'Status': product.status ? 'Active' : 'Inactive'
        }));
        return this.responseService.response(products);
    }

    async listProductFromCategory(categoryId: number) {
        const {data: productList} = await this.gatewayService.execute(MicroService.Product, {
            method: "GET",
            path: `/api/v1/product/category/${categoryId}`,
        });
        const products = (productList || []).map((product: any, index: any) => ({
            id: product.id,
            'Name': product.name,
            'status': product.status
        }));
        return this.responseService.response(products);
    }

    async changeStatus(id: number) {
        const data = await this.gatewayService.execute("product", {
            method: "PUT",
            path: `/api/v1/product/${id}/status`,
        });

        return this.responseService.response(data);
    }

    async get(productId: number) {
        const {data: product} = await this.gatewayService.execute(MicroService.Product, {
            method: "GET",
            path: `/api/v1/product/${productId}`,
        });
        return this.responseService.response(product);
    }

    async delete(productId: number) {
        const res = await this.gatewayService.execute(MicroService.Product, {
            method: "DELETE",
            path: `/api/v1/product/${productId}`,
        });
        return this.responseService.response(res);
    }
}
