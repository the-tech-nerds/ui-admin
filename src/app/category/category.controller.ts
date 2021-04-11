import {Body, Controller, Get, Param, Post, Put} from "@nestjs/common";
import { ShopTypes } from "@the-tech-nerds/common-services";
import { ApiResponseService } from "../common/response/api-response.service";
import CategoryService from "./category.service";

@Controller('/api/categories')
export default class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly responseService: ApiResponseService
    ) {
    }

    @Post('/')
    async create(
        @Body() categoryCreateRequest: any
    ) {
        return this.categoryService.createCategory(categoryCreateRequest);
    }

    @Put('/:id')
    async update(
        @Body() categoryUpdateRequest: any, @Param('id') id: number
    ) {
        return this.categoryService.updateCategory(id, categoryUpdateRequest);
    }

    @Get('/')
    async get() {
        return this.categoryService.listCategories();
    }

    @Get('/shop/:shopId')
    async getCategoriesByShop(
        @Param('shopId') shopId: number
    ) {
        return this.categoryService.listCategoriesByShop(shopId);
    }

    @Get('/shop/type')
    async getShopType() {
        return this.responseService.response(ShopTypes);
    }
    @Get('/:id')
    async getCategory(@Param('id') id: number) {
        return this.categoryService.getCategory(id);
    }

    @Put('/:id/status')
    async changeStatus(
        @Param('id') id: number
    ) {
        return this.categoryService.changeStatus(id);
    }

    @Get('/menu/all')
    async getCetagoryMenu() {
        return this.categoryService.getMenuCategory();
    }

}
