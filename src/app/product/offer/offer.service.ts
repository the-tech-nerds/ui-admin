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
    updateStatus(id: number, status: number) {
        return this.gatewayService.execute(MicroService.Product, {
            method: "PUT",
            path: `/api/v1/offer/${id}/status/${status}`,
            body: null,
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
            'price': offer.total_price,
            'Start Date': moment(offer.start_date).format('YYYY-MM-DD HH:mm:ss'),
            'End Date': moment(offer.end_date).format('YYYY-MM-DD HH:mm:ss'),
            'Offer Status': offer.status == 1? 'active' : offer.status == 2 ? 'inactive' : 'draft',
             status: offer.status
        }));
        return this.responseService.response(offers);
    }

    async get(offerId: number) {
        const { data: offer } = await this.gatewayService.execute(MicroService.Product, {
            method: "GET",
            path: `/api/v1/offer/${offerId}`,
        });
        return this.responseService.response(offer);
    }
    async delete(offerId: number) {
        const res = await this.gatewayService.execute(MicroService.Product, {
            method: "DELETE",
            path: `/api/v1/offer/${offerId}`,
        });
        return this.responseService.response(res);
    }
}
