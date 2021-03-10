import {Body, Controller, Delete, Param, Post, Put, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';


@Controller('/api/file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
  ) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async upload(
    @UploadedFile() file: any,
    @Body() content: any,
    @Res() res: Response,
  ) {
    const model = JSON.parse(content.fileStoreInfo);
    const result = await this.fileService.create(file, model);
    return res.json(result);
  }

  @Delete('/:id')
  async DeleteFile(
    @Param('id') id: number,
    @Body() content: any,
    @Res() res: Response,
  ) {
    const result = await this.fileService.delete(id, content);
    return res.json(result);
  }
  @Put('update')
  async Update(
      @Body() content: any,
      @Res() res: Response,
  ) {
    const result = await this.fileService.update( content);
    return res.json(result);
  }
}
