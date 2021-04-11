import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {InventoryService} from "./inventory.service";


@Controller('/api/inventories')
export default class InventoryController {
    constructor(
        private readonly inventoryService: InventoryService
    ) {
    }

    @Get('/')
    async gets() {
        return this.inventoryService.listInventories();
    }

    @Post('/')
    async create(
        @Body() inventoryRequest: any
    ) {
        return this.inventoryService.create(inventoryRequest);
    }

    @Put('/update/:id')
    async update(
        @Param('id') id: number,
        @Body() inventoryRequest: any
    ) {
        return this.inventoryService.update(id, inventoryRequest);
    }

    @Put('/:id/status')
    async changeStatus(@Param('id') id: number) {
        return this.inventoryService.changeStatus(id);
    }

    @Get('/:id')
    async get(@Param('id') id: number) {
        return this.inventoryService.get(id);
    }

    @Delete('/:id')
    async delete(@Param('id') id: number) {
        return this.inventoryService.delete(id);
    }
}
