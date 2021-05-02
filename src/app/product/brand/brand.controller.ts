import {Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
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
        brandRequest.supplier_id = Number(brandRequest.supplier_id);
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

    @Get('/list/all/:supplierId')
    async getBySupplier(@Param('supplierId') supplierId: number) {
        return this.brandService.getBySupplier(supplierId);
    }

    @Delete('/:id')
    async delete( @Param('id') id: number) {
        return this.brandService.delete(id);
    }
}
