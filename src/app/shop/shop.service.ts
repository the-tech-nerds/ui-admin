import {GatewayService} from "@the-tech-nerds/common-services";
import {Injectable} from "@nestjs/common";
import {ApiResponseService} from "../common/response/api-response.service";
import MicroService from "../constants/app-constants"


@Injectable()
export class ShopService {
    constructor(
        private readonly gatewayService: GatewayService,
        private readonly responseService: ApiResponseService
    ) {
    }

    create(shop: any) {
        return this.gatewayService.execute(MicroService.Product, {
            method: "POST",
            path: '/api/v1/shop',
            body: shop,
        });
    }

    update(id: number, shop: any) {
        return this.gatewayService.execute(MicroService.Product, {
            method: "PUT",
            path: `/api/v1/shop/${id}`,
            body: {...shop},
        });
    }


    async gets() {
        const {data: shopList} = await this.gatewayService.execute(MicroService.Product, {
            method: "GET",
            path: '/api/v1/shop/list/all',
        });
        const shops = shopList.map((shop: any, index: any) => ({
            id: shop.id,
            'SL No': ++index,
            'Name': shop.name,
            'Description': shop.description,
            'Address': shop.address,
            'type_id': shop.type_id
        }));
        return this.responseService.response(shops);
    }


    async get(shopId: number) {
        const {data: shop} = await this.gatewayService.execute(MicroService.Product, {
            method: "GET",
            path: `/api/v1/shop/${shopId}`,
        });
        return this.responseService.response(shop);
    }
}
