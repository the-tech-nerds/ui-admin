import { GatewayService } from "@the-tech-nerds/common-services";
import {Injectable } from "@nestjs/common";
import { ApiResponseService } from "../response/api-response.service";
// import * as axios from 'axios'
@Injectable()
export class FileService {
    constructor(
        private readonly gatewayService: GatewayService,
        // private httpService: HttpService
        private readonly responseService: ApiResponseService
    ) {
    }

   async create(file: any, content: any, microService: string): Promise<any>{
        var FormData = require("form-data");
        const formData = new FormData();
        formData.append('image', file.buffer, { filename: file.originalname });
        formData.append('fileStoreInfo', JSON.stringify({
            entity: content.entity,
            folder: content.folder,
            entity_id: content.entity_id
          }))
        const res = await this.gatewayService.execute(microService, {
            method: "POST",
            path: '/api/v1/file/upload',
            headers: {
                ...formData.getHeaders(),
                "Content-Length": formData.getLengthSync()
            },
            body: formData,
            contentType: 'FILE'
        });

         return this.responseService.response(res);
    }
}
