import {Body, Controller, Get, Param, Post, Query} from "@nestjs/common";
import UserService from "./user.service";

@Controller('/api/users')
export default class UserController {

    constructor(
        private readonly userService: UserService
    ) {
    }


    @Post('/')
    async create(
        @Body() userCreateRequest: any
    ) {
        return this.userService.createUser(userCreateRequest);
    }

    @Get('/')
    async get(@Query('type') type: any) {
        if (type === 'admin') {
            return this.userService.listAdmins();
        }
        return this.userService.listUsers();
    }

    @Get('/:id')
    async getUser(@Param('id') id: number) {
        return this.userService.getUser(id);
    }
}