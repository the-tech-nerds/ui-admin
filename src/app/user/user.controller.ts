import {Body, Controller, Get, Param, Post, Query} from "@nestjs/common";
import UserService from "./user.service";
import {UserLoginRequest} from "./requests/user.login.request";
import {ResetPasswordRequest} from "./requests/reset-password.request";

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
    @Post('/reset-password')
    async resetPassword(
        @Body() resetPasswordRequest: ResetPasswordRequest
    ) {
        resetPasswordRequest.user_id = 38;
        return this.userService.resetPassword(resetPasswordRequest);
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
