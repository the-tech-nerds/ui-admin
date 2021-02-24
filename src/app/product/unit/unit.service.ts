import {GatewayService} from "@the-tech-nerds/common-services";
import {Injectable} from "@nestjs/common";
import MicroService from "../../constants/app-constants"
import { ApiResponseService } from "src/app/common/response/api-response.service";

@Injectable()
export class UnitService {
    constructor(
        private readonly gatewayService: GatewayService,
        private readonly responseService: ApiResponseService
    ) {
    }

    create(unit: any) {
        return this.gatewayService.execute(MicroService.Product, {
            method: "POST",
            path: '/api/v1/product/unit',
            body: unit,
        });
    }
    update(id: number,unit: any) {
        return this.gatewayService.execute(MicroService.Product, {
            method: "PUT",
            path: `/api/v1/product/unit/${id}`,
            body: { ...unit},
        });
    }


    async gets() {
        const {data: UnitList} = await this.gatewayService.execute(MicroService.Product, {
            method: "GET",
            path: '/api/v1/product/unit/list/all',
        });
        const units = UnitList.map((unit: any, index: any) => ({
            id: unit.id,
            'SL No': ++index,
            'Name': unit.name,
            'Description': unit.description
        }));
        return this.responseService.response(units);
    }



    async get(UnitId: number) {
        const {data: unit} = await this.gatewayService.execute(MicroService.Product, {
            method: "GET",
            path: `/api/v1/product/unit/${UnitId}`,
        });
        return this.responseService.response(unit);
    }
}
