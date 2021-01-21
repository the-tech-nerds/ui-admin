import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
    HttpException,
} from '@nestjs/common';

@Catch()
export class ErrorFilter implements ExceptionFilter {
    constructor() {}

    catch(error: Error, host: ArgumentsHost) {
        const res = host.switchToHttp().getResponse();
        const status =
            error instanceof HttpException
                ? error.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;
        if (status === HttpStatus.UNAUTHORIZED) {
            return res.redirect('/logout');
        }  else if(status === HttpStatus.NOT_FOUND){
            res.redirect('/404');
        } else {
            const message = error.message;
            return res.status(status).json({
                message,
                status,
                code: status,
                data: null,
            });
        }
    }
}
