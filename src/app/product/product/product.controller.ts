import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {ProductService} from "./product.service";


@Controller('/api/products')
export default class ProductController {
    constructor(
        private readonly productService: ProductService
    ) {
    }

    @Get('/')
    async gets() {
        return this.productService.listProducts();
    }

    @Post('/')
    async create(
        @Body() productRequest: any
    ) {
        return this.productService.create(productRequest);
    }

    @Put('/update/:id')
    async update(
        @Param('id') id: number,
        @Body() productRequest: any
    ) {
        return this.productService.update(id, productRequest);
    }

    @Put('/:id/status')
    async changeStatus(@Param('id') id: number) {
        return this.productService.changeStatus(id);
    }

    @Get('/:id')
    async get(@Param('id') id: number) {
        return this.productService.get(id);
    }

    @Delete('/:id')
    async delete(@Param('id') id: number) {
        return this.productService.delete(id);
    }
}
