import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import RoleService from "./role.service";

@Controller('/api/roles')
export default class RoleController {

    constructor(
        private readonly roleService: RoleService
    ) {
    }


    @Post('/')
    async create(
        @Body() roleCreateRequest: any
    ) {
        return this.roleService.createRole(roleCreateRequest);
    }

    @Get('/')
    async get() {
        return this.roleService.listRoles();
    }

    @Get('/:id/permissions')
    async getRolePermissions(@Param('id') id: number) {
        return this.roleService.getRolePermissions(id);
    }
}
