import {GatewayService} from "@the-tech-nerds/common-services";
import {Injectable} from "@nestjs/common";
import MicroService from "../../constants/app-constants"
import {ApiResponseService} from "src/app/common/response/api-response.service";

@Injectable()
export class InventoryService {
    constructor(
        private readonly gatewayService: GatewayService,
        private readonly responseService: ApiResponseService
    ) {
    }

    create(inventory: any) {
        return this.gatewayService.execute(MicroService.Product, {
            method: "POST",
            path: '/api/v1/inventory',
            body: inventory,
        });
    }

    update(id: number, inventory: any) {
        return this.gatewayService.execute(MicroService.Product, {
            method: "PUT",
            path: `/api/v1/inventory/${id}`,
            body: inventory,
        });
    }


    async listInventories() {
        const {data: inventoryList} = await this.gatewayService.execute(MicroService.Product, {
            method: "GET",
            path: '/api/v1/inventory',
        });
        const inventories = inventoryList.map((inventory: any, index: any) => ({
            id: inventory.id,
            'SL No': ++index,
            'Shop': inventory?.shops?.reduce((shops: any, shop: any) => (shops + shop.name + ', '), '').slice(0, -2) || 'n/a',
            'Variance': inventory.productVariance ? inventory.productVariance.name : 'n/a',
            'Stock Unit' : inventory.stock_count,
            'Stock Price' : inventory.price,
            'Stock Date': inventory.stock_date,
            'Status': inventory.status ? 'Active' : 'Draft'
        }));
        return this.responseService.response(inventories);
    }

    async changeStatus(id: number) {
        const data = await this.gatewayService.execute("inventory", {
            method: "PUT",
            path: `/api/v1/inventory/${id}/status`,
        });

        return this.responseService.response(data);
    }

    async get(inventoryId: number) {
        const {data: inventory} = await this.gatewayService.execute(MicroService.Product, {
            method: "GET",
            path: `/api/v1/inventory/${inventoryId}`,
        });
        return this.responseService.response(inventory);
    }

    async delete(inventoryId: number) {
        const res = await this.gatewayService.execute(MicroService.Product, {
            method: "DELETE",
            path: `/api/v1/inventory/${inventoryId}`,
        });
        return this.responseService.response(res);
    }
}
