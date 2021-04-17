import { GatewayService } from "@the-tech-nerds/common-services";
import { Injectable } from "@nestjs/common";
import { ApiResponseService } from "../common/response/api-response.service";
import MicroService from "../constants/app-constants"


@Injectable()
export class SupplierService {
    constructor(
        private readonly gatewayService: GatewayService,
        private readonly responseService: ApiResponseService
    ) {
    }

    create(supplier: any) {
        return this.gatewayService.execute(MicroService.Product, {
            method: "POST",
            path: '/api/v1/supplier',
            body: supplier,
        });
    }
    update(id: number, supplier: any) {
        return this.gatewayService.execute(MicroService.Product, {
            method: "PUT",
            path: `/api/v1/supplier/${id}`,
            body: { ...supplier },
        });
    }


    async gets() {
        const { data: supplierList } = await this.gatewayService.execute(MicroService.Product, {
            method: "GET",
            path: '/api/v1/supplier/list/all',
        });
        const suppliers = supplierList.map((supplier: any, index: any) => ({
            id: supplier.id,
            'SL No': ++index,
            'Name': supplier.name,
            'Description': supplier.description,
            'Address': supplier.address,
            'Phone': supplier.phone,
            'Email': supplier.email,
            'IsActive': supplier.is_active
        }));
        return this.responseService.response(suppliers);
    }



    async get(supplierId: number) {
        const { data: supplier } = await this.gatewayService.execute(MicroService.Product, {
            method: "GET",
            path: `/api/v1/supplier/${supplierId}`,
        });
        return this.responseService.response(supplier);
    }
}
