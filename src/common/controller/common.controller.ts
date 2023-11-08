import { Controller, Get, HttpStatus, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";

@Controller()
@ApiTags('Common API')
export class CommonController {
  
  @Get('/health')
  home(@Res() response: Response) {
    response.status(HttpStatus.OK).send();
  }
}