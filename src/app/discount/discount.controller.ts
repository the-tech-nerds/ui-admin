import {Body, Controller, Get, Param, Post, Put} from "@nestjs/common";
import DiscountService from "./discount.service";

@Controller('/api/discounts')
export default class DiscountController {
    constructor(
        private readonly discountService: DiscountService,
    ) {
    }

    @Post('/')
    async create(
        @Body() discountCreateRequest: any
    ) {
        return this.discountService.createDiscount(discountCreateRequest);
    }

    @Post('/assign')
    async assignDiscount(
        @Body() discountAssignRequest: any
    ) {
        return this.discountService.assign(discountAssignRequest);
    }

    @Put('/:id')
    async update(
        @Body() discountUpdateRequest: any, @Param('id') id: number
    ) {
        return this.discountService.updateDiscount(id, discountUpdateRequest);
    }

    @Get('/')
    async get() {
        return this.discountService.listDiscounts();
    }

    @Put('/:id/status')
    async changeStatus(
        @Param('id') id: number
    ) {
        return this.discountService.changeStatus(id);
    }
}
