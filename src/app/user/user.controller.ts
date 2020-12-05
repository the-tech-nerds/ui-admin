import {Body, Controller, Get, Post} from "@nestjs/common";
import UserService from "./user.service";
import {UserLoginRequest} from "./requests/user.login.request";

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

    @Post('/login')
    async login(
        @Body() userLoginRequest: UserLoginRequest
    ) {
        return this.userService.loginUser(userLoginRequest);
    }

    @Get('/')
    async get() {
        return this.userService.listUsers();
    }
}
