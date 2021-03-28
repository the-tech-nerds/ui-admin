import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {ProductVarianceService} from "./product-variance.service";


@Controller('/api/product-variances')
export default class ProductVarianceController {
    constructor(
        private readonly productVarianceService: ProductVarianceService
    ) {
    }

    @Get('/:productId')
    async gets(@Param('productId') productId: number) {
        return this.productVarianceService.listProductVariances(productId);
    }

    @Post('/:productId')
    async create(
        @Param('productId') productId: number,
        @Body() productVarianceRequest: any
    ) {
        productVarianceRequest.product_id = productId;
        return this.productVarianceService.create(productVarianceRequest);
    }

    @Put('/:productId/update/:id')
    async update(
        @Param('id') id: number,
        @Param('productId') productId: number,
        @Body() productVarianceRequest: any
    ) {
        productVarianceRequest.product_id = productId;
        return this.productVarianceService.update(id, productVarianceRequest);
    }

    @Put('/:id/status')
    async changeStatus(@Param('id') id: number) {
        return this.productVarianceService.changeStatus(id);
    }

    @Get('single/:id')
    async get(@Param('id') id: number) {
        return this.productVarianceService.get(id);
    }

    @Delete('/:id')
    async delete(@Param('id') id: number) {
        return this.productVarianceService.delete(id);
    }
}
