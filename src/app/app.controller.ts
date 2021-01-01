import {Controller, Get, Render, Res} from '@nestjs/common';
import UserService from './user/user.service';
@Controller()
export class AppController {
    constructor(
        private readonly userService: UserService
    ) {
    }
    @Get('/')
    @Render('pages/main')
    app() {
        return {};
    }

    @Get('/logout')
    logout(@Res() res: any) {
        this.userService.logOutUser();
        res.clearCookie('r_code');
        return res.redirect('/auth/login');
    }
}
