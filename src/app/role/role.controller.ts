import {Body, Controller, Get, Param, Post, Put} from "@nestjs/common";
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
        console.log(id);
        return this.roleService.getRolePermissions(id);
    }

    @Put('/:id/update')
    async updateRolePermissions(@Body() roleCreateRequest: any, @Param('id') id: number) {
        return this.roleService.updateRolePermissions(id, roleCreateRequest);
    }

    @Put('/:id/details')
    async getRoleDetailsById(@Body() roleCreateRequest: any, @Param('id') id: number) {
        return this.roleService.getRoleDetailsById(id, roleCreateRequest);
    }

    @Get('/:id/details')
    async getPermissionsFromRole(@Param('id') roleId: number) {
        return this.roleService.getPermissionsFromRole(roleId);
    }
}
