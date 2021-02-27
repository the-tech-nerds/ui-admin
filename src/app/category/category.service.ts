import {GatewayService} from "@the-tech-nerds/common-services";
import {Injectable} from "@nestjs/common";
import {ApiResponseService} from "../common/response/api-response.service";

@Injectable()
export default class CategoryService {
    constructor(
        private readonly gatewayService: GatewayService,
        private readonly responseService: ApiResponseService
    ) {
    }

    createCategory(category : any) {
        return this.gatewayService.execute("product", {
            method: "POST",
            path: '/api/v1/category',
            body: category,
        });
    }

    updateCategory(category: any) {
        return this.gatewayService.execute("product", {
            method: "PUT",
            path: '/api/v1/category',
            body: { ...category},
        });
    }

    async listCategories() {
        console.log('in category list service');
        const {data: categoryList} = await this.gatewayService.execute("product", {
            method: "GET",
            path: '/api/v1/category/all',
        });

        console.log('category list : ', categoryList);

        const categories = categoryList.map((category: any, index: any) => ({
            id: category.id,
            'SL No': ++index,
            'Name': category.name,
            'Parent Category': category.parent_id,
            'Slug': category.slug,
            'Active': category.is_active ? 'Yes' : 'No'
        }));

        console.log('in categories fetch', categories);

        return this.responseService.response(categories);
    }

    async getCategory(categoryId: number) {
        const {data: category} = await this.gatewayService.execute("product", {
            method: "GET",
            path: `/api/v1/category/${categoryId}`,
        });
        const {
            id,
            parent_id,
            name,
            is_active
        } = category;

        return this.responseService.response({
            id,
            parent_id,
            name,
            is_active
        });
    }


    async changeStatus(categoryId: number) {
        return await this.gatewayService.execute("product", {
            method: "PUT",
            path: `/api/v1/category/${categoryId}/status`,
        });
    }
}
