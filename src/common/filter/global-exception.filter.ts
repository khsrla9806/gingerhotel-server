import { LocalDateTime } from "@js-joda/core";
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { Response } from "express";
import * as winston from 'winston';
import { ErrorCode } from "./code/error-code.enum";

const { simple } = winston.format;

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly apiLogger;
  private readonly basicLogger;

  constructor() {
    this.apiLogger = winston.createLogger({
      transports: [
        new winston.transports.File({
          level: 'error',
          filename: 'api.error.log',
          dirname: 'logs',
          format: simple()
        })
    ]});

    this.basicLogger = winston.createLogger({
      transports: [
        new winston.transports.File({
          level: 'error',
          filename: 'basic.error.log',
          dirname: 'logs',
          format: simple()
        })
    ]});
  }

  catch(exception: any, host: ArgumentsHost) {
    const httpArgumentHosts: HttpArgumentsHost = host.switchToHttp();
    const response: Response = httpArgumentHosts.getResponse();
    const requestUrl: string = host.getArgs()[0].url;

    if (exception instanceof HttpException) {
      let status: number = exception.getStatus();
      let errorCode: ErrorCode = exception.getResponse()['error'];

      if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        errorCode = ErrorCode.InternalServerError;
        this.apiLogger.error(`[${LocalDateTime.now()}][${requestUrl}] ${exception}`);
      }

      if (status === HttpStatus.UNAUTHORIZED) {
        errorCode = ErrorCode.NotAuthenticated;
      }

      response
        .status(status)
        .json({
          success: false,
          errorCode: errorCode,
          errorMessage: exception.getResponse()['message']
        });
      
      return;
    }

    this.basicLogger.error(`[${LocalDateTime.now()}][${requestUrl}] ${exception}`);

    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        errorCode: ErrorCode.InternalServerError,
        errorMessage: exception.message
      });
  }
}