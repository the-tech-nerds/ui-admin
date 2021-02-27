import {Body, Controller, Get, Param, Post, Put} from "@nestjs/common";
import CategoryService from "./category.service";

@Controller('/api/categories')
export default class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ) {
    }

    @Post('/')
    async create(
        @Body() categoryCreateRequest: any
    ) {
        return this.categoryService.createCategory(categoryCreateRequest);
    }

    @Put('/')
    async update(
        @Body() categoryUpdateRequest: any
    ) {
        return this.categoryService.updateCategory(categoryUpdateRequest);
    }

    @Get('/')
    async get() {
        return this.categoryService.listCategories();
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
}
