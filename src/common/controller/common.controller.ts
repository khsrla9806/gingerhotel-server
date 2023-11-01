import { Controller, Get, HttpStatus, Res } from "@nestjs/common";
import { Response } from "express";

@Controller()
export class CommonController {
  
  @Get('/health')
  home(@Res() response: Response) {
    response.status(HttpStatus.OK).send();
  }
}