import {Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { UnitRequest } from "./requests/unit.request";
import { UnitService } from "./unit.service";


@Controller('/api/units')
export default class UnitController {
    constructor(
        private readonly unitService: UnitService
    ) {
    }

    @Post('/')
    async create(
        @Body() shopRequest: UnitRequest
    ) {
        return this.unitService.create(shopRequest);
    }

    @Put('/update/:id')
    async update(
        @Param('id') id: number,
        @Body() shopRequest: UnitRequest
    ) {
        return this.unitService.update(id,shopRequest);
    }
    @Get('/:id')
    async get(@Param('id') id: number) {
        return this.unitService.get(id);
    }

    @Get('/list/all')
    async gets() {
        return this.unitService.gets();
    }
}
