import {Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import {OfferService} from "./offer.service";
@Controller('/api/offers')
export default class OfferController {
    constructor(
        private readonly offerService: OfferService
    ) {
    }

    @Post('/')
    async create(
        @Body() offerRequest: any
    ) {
        console.log(offerRequest);
        return this.offerService.create(offerRequest);
    }

    @Put('/update/:id')
    async update(
        @Param('id') id: number,
        @Body() offerRequest: any
    ) {
        return this.offerService.update(id,offerRequest);
    }
    @Get('/:id')
    async get(@Param('id') id: number) {
        return this.offerService.get(id);
    }

    @Get('/list/all')
    async gets() {
        return this.offerService.gets();
    }

    @Delete('/:id')
    async delete( @Param('id') id: number) {
        return this.offerService.delete(id);
    }
}
