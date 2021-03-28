import { HttpModule, Module } from '@nestjs/common';
import {CacheModule, GatewayModule} from "@the-tech-nerds/common-services";
import {ApiResponseService} from "../common/response/api-response.service";
import { FileController } from './file/file.controller';
import { FileService } from './file/file.service';

@Module({
    imports: [
        CacheModule,
        GatewayModule,
        HttpModule
    ],
    controllers: [FileController],
    providers: [FileService, ApiResponseService]
})
export class CommonModule {}