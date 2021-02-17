import {Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { ShopRequest } from "./requests/shop.request";
import { ShopService } from "./shop.service";

@Controller('/api/shops')
export default class ShopController {
    constructor(
        private readonly shopService: ShopService
    ) {
    }

    @Post('/')
    async create(
        @Body() shopRequest: ShopRequest
    ) {
        return this.shopService.create(shopRequest);
    }

    @Put('/update/:id')
    async update(
        @Param('id') id: number,
        @Body() shopRequest: ShopRequest
    ) {
        return this.shopService.update(id,shopRequest);
    }
    @Get('/:id')
    async get(@Param('id') id: number) {
        return this.shopService.get(id);
    }

    @Get('/list/all')
    async gets() {
        return this.shopService.gets();
    }
}
