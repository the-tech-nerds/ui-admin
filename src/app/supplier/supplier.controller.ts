import {Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { SupplierRequest } from "./requests/supplier.request";
import { SupplierService } from "./supplier.service";


@Controller('/api/suppliers')
export default class supplierController {
    constructor(
        private readonly supplierService: SupplierService
    ) {
    }

    @Post('/')
    async create(
        @Body() supplierRequest: SupplierRequest
    ) {
        return this.supplierService.create(supplierRequest);
    }

    @Put('/update/:id')
    async update(
        @Param('id') id: number,
        @Body() supplierRequest: SupplierRequest
    ) {
        return this.supplierService.update(id,supplierRequest);
    }
    @Get('/:id')
    async get(@Param('id') id: number) {
        return this.supplierService.get(id);
    }

    @Get('/list/all')
    async gets() {
        return this.supplierService.gets();
    }
}
