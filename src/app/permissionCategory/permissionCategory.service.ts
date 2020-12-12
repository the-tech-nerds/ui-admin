import {GatewayService} from "@technerds/common-services";
import {Injectable} from "@nestjs/common";

@Injectable()
export default class PermissionCategoryService {
    constructor(
        private readonly gatewayService: GatewayService,
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
        return {
            code: 200,
            data: categoryList,
        };
    }
}
