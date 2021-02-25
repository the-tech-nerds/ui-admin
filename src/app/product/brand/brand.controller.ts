import {Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { BrandService } from "./brand.service";
import { BrandRequest } from "./requests/brand.request";


@Controller('/api/brands')
export default class BrandController {
    constructor(
        private readonly brandService: BrandService
    ) {
    }

    @Post('/')
    async create(
        @Body() brandRequest: BrandRequest
    ) {
        return this.brandService.create(brandRequest);
    }

    @Put('/update/:id')
    async update(
        @Param('id') id: number,
        @Body() brandRequest: BrandRequest
    ) {
        return this.brandService.update(id,brandRequest);
    }
    @Get('/:id')
    async get(@Param('id') id: number) {
        return this.brandService.get(id);
    }

    @Get('/list/all')
    async gets() {
        return this.brandService.gets();
    }
}
