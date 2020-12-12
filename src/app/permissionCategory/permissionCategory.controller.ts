import {Body, Controller, Get, Post} from "@nestjs/common";
import PermissionCategoryService from "./permissionCategory.service";

@Controller('/api/permission-categories')
export default class PermissionCategoryController {

    constructor(
        private readonly categoryService: PermissionCategoryService
    ) {
    }


    @Post('/')
    async create(
        @Body() categoryCreateRequest: any
    ) {
        return this.categoryService.createCategory(categoryCreateRequest);
    }

    @Get('/')
    async get() {
        return this.categoryService.listCategories();
    }
}
