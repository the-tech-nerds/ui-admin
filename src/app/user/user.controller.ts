import {Body, Controller, Get, Post} from "@nestjs/common";
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
    async get() {
        return this.userService.listUsers();
    }
}
