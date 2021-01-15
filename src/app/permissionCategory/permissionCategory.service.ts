import {GatewayService} from "@the-tech-nerds/common-services";
import {Injectable} from "@nestjs/common";
import {ApiResponseService} from "../common/response/api-response.service";

@Injectable()
export default class PermissionCategoryService {
    constructor(
        private readonly gatewayService: GatewayService,
        private readonly responseService: ApiResponseService,
    ) {
    }

    createCategory(category: any) {
        return this.gatewayService.execute("auth", {
            method: "POST",
            path: '/api/v1/authorization/permission/category',
            body: category,
        });
    }

    async listCategories() {
        const { data: categoryList } = await this.gatewayService.execute("auth", {
            method: "GET",
            path: '/api/v1/authorization/permission/categories',
        });

        return this.responseService.response(categoryList);
    }
}
