import { LocalDateTime } from "@js-joda/core";
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { Response } from "express";
import * as winston from 'winston';

const { combine, timestamp, simple, printf } = winston.format;

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

      if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        this.apiLogger.error(`[${LocalDateTime.now()}][${requestUrl}] ${exception}`);
      }

      response
        .status(status)
        .json({
          success: false,
          error: exception.message
        });
      
      return;
    }

    this.basicLogger.error(`[${LocalDateTime.now()}][${requestUrl}] ${exception}`);

    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        error: exception.message
      });
  }
}