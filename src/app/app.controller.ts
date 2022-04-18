import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { HEALTH_API } from '../app-constants/routes';

@Controller()
export class AppController {
  @Get(HEALTH_API)
  getHello(@Res() res: Response) {
    return res.status(HttpStatus.OK).json();
  }
}
