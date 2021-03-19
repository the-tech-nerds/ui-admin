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
        category.parent_id = category.parent_id? category.parent_id: 0;
        return this.gatewayService.execute("product", {
            method: "POST",
            path: '/api/v1/category',
            body: category,
        });
    }

    updateCategory(id: number, category: any) {
        category.parent_id = category.parent_id? category.parent_id: 0;
        return this.gatewayService.execute("product", {
            method: "PUT",
            path: `/api/v1/category/${id}`,
            body: { ...category},
        });
    }

    async listCategories() {
        const {data: categoryList} = await this.gatewayService.execute("product", {
            method: "GET",
            path: '/api/v1/category/all',
        });
        const categories = categoryList.map((category: any, index: any) => ({
            id: category.id,
            'SL No': ++index,
            'Name': category.name,
            'Parent Category': this.findParent(categoryList,category.parent_id),
            'Slug': category.slug,
            'Active': category.is_active ? 'Yes' : 'No'
        }));

        return this.responseService.response(categories);
    }

    async getCategory(categoryId: number) {
        return this.gatewayService.execute("product", {
            method: "GET",
            path: `/api/v1/category/${categoryId}`,
        });
    }


    async changeStatus(categoryId: number) {
        return this.gatewayService.execute("product", {
            method: "PUT",
            path: `/api/v1/category/${categoryId}/status`,
        });
    }
    async getMenuCategory() {
        return this.gatewayService.execute("product", {
            method: "GET",
            path: `/api/v1/category/menu/all`,
        });
    }
    private findParent(data: any, parent_id: number){
        if(parent_id === 0) return 'N/A'
        const parent = data.find( (x:any) =>x.id === parent_id);
        return parent.name;
    }
}
