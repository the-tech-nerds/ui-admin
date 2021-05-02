import { GatewayService } from "@the-tech-nerds/common-services";
import { Injectable } from "@nestjs/common";
import MicroService from "../../constants/app-constants"
import { ApiResponseService } from "src/app/common/response/api-response.service";

@Injectable()
export class BrandService {
    constructor(
        private readonly gatewayService: GatewayService,
        private readonly responseService: ApiResponseService
    ) {
    }

    create(brand: any) {
        brand.supplier_id = brand.supplier_id == 0 ? null : brand.supplier_id;
        return this.gatewayService.execute(MicroService.Product, {
            method: "POST",
            path: '/api/v1/brand',
            body: brand,
        });
    }
    update(id: number, brand: any) {
        brand.supplier_id = brand.supplier_id == 0 ? null : brand.supplier_id;
        return this.gatewayService.execute(MicroService.Product, {
            method: "PUT",
            path: `/api/v1/brand/${id}`,
            body: { ...brand },
        });
    }


    async gets() {
        const { data: brandList } = await this.gatewayService.execute(MicroService.Product, {
            method: "GET",
            path: '/api/v1/brand/list/all',
        });
        const brands = brandList.map((brand: any, index: any) => ({
            id: brand.id,
            'SL No': ++index,
            'Name': brand.name,
            'Description': brand.description,
            'Supplier': brand?.supplier?.name
        }));
        return this.responseService.response(brands);
    }

    async getBySupplier(supplierId: number) {
        const { data: brandList } = await this.gatewayService.execute(MicroService.Product, {
            method: "GET",
            path: `/api/v1/brand/list/all/${supplierId}`,
        });
        const brands = brandList.map((brand: any, index: any) => ({
            id: brand.id,
            'SL No': ++index,
            'Name': brand.name,
            'Description': brand.description,
        }));
        return this.responseService.response(brands);
    }



    async get(brandId: number) {
        const { data: brand } = await this.gatewayService.execute(MicroService.Product, {
            method: "GET",
            path: `/api/v1/brand/${brandId}`,
        });
        return this.responseService.response(brand);
    }
    async delete(brandId: number) {
        const res = await this.gatewayService.execute(MicroService.Product, {
            method: "DELETE",
            path: `/api/v1/brand/${brandId}`,
        });
        return this.responseService.response(res);
    }
}
