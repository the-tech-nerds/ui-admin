import { Response } from 'express';
import {Injectable} from '@nestjs/common';

@Injectable()
export class ApiResponseService {
  response(
    data: any[] | any,
  ): ResponseModel {
    return {
      code: 200,
      data
    }
  }

  successResponse(
    message: string[] | string,
    data: any,
    res: Response,
  ): Response<ResponseModel> {
    return res.status(200).json({
      code: 200,
      data,
    });
  }

  notFoundError(message: string[], res: Response): Response<ResponseModel> {
    return res.status(404).json({
      code: 404,
      data: null,
    });
  }

  badRequestError(
    message: string[] | string,
    res: Response,
  ): Response<ResponseModel> {
    return res.status(400).json({
      code: 400,
      data: null,
    });
  }

  unAuthorizedError(
    message: string[] | string,
    res: Response,
  ): Response<ResponseModel> {
    return res.status(401).json({
      code: 401,
      data: null,
    });
  }

  forbiddenError(
    message: string[] | string,
    res: Response,
  ): Response<ResponseModel> {
    return res.status(403).json({
      code: 403,
      data: null,
    });
  }

  internalServerError(
    message: string[] | string,
    res: Response,
  ): Response<ResponseModel> {
    return res.status(500).json({
      code: 500,
      data: null,
    });
  }
}
