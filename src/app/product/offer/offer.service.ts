import { GatewayService } from "@the-tech-nerds/common-services";
import { Injectable } from "@nestjs/common";
import MicroService from "../../constants/app-constants"
import { ApiResponseService } from "src/app/common/response/api-response.service";
import * as moment from "moment";

@Injectable()
export class OfferService {
    constructor(
        private readonly gatewayService: GatewayService,
        private readonly responseService: ApiResponseService
    ) {
    }

    create(offer: any) {
        return this.gatewayService.execute(MicroService.Product, {
            method: "POST",
            path: '/api/v1/offer',
            body: offer,
        });
    }
    update(id: number, offer: any) {
        return this.gatewayService.execute(MicroService.Product, {
            method: "PUT",
            path: `/api/v1/offer/${id}`,
            body: { ...offer },
        });
    }


    async gets() {
        const { data: offerList } = await this.gatewayService.execute(MicroService.Product, {
            method: "GET",
            path: '/api/v1/offer/list/all',
        });
        const offers = offerList.map((offer: any, index: any) => ({
            id: offer.id,
            'SL No': ++index,
            'Name': offer.name,
            'Description': offer.description,
            'Start Date': moment(offer.start_date).format('YYYY-MM-DD HH:mm:ss'),
            'End Date': moment(offer.end_date).format('YYYY-MM-DD HH:mm:ss'),
        }));
        return this.responseService.response(offers);
    }

    async getBySupplier(supplierId: number) {
        const { data: brandList } = await this.gatewayService.execute(MicroService.Product, {
            method: "GET",
            path: `/api/v1/offer/list/all/${supplierId}`,
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
            path: `/api/v1/offer/${brandId}`,
        });
        return this.responseService.response(brand);
    }
    async delete(brandId: number) {
        const res = await this.gatewayService.execute(MicroService.Product, {
            method: "DELETE",
            path: `/api/v1/offer/${brandId}`,
        });
        return this.responseService.response(res);
    }
}