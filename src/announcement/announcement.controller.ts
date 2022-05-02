import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { AnnouncementService } from './announcement.service';
import { IAuthenticateReq } from '../app-constants/interfaces';
import { CreateAnnouncementDTO } from './dto/createAnnouncement.dto';
import { AuthGuard } from '../middlewares/auth/auth.guard';
import { ANNOUNCEMENT_API } from '../app-constants/routes';

@Controller(ANNOUNCEMENT_API)
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @UseGuards(AuthGuard)
  @Post('add')
  public async createAnnouncement(
    @Req() req: IAuthenticateReq,
    @Body() body: CreateAnnouncementDTO,
    @Res() res: Response,
  ) {
    const { userId } = req.user;
    const announcement = await this.announcementService.createAnnouncement(
      userId,
      body,
    );
    return res.status(HttpStatus.CREATED).json(announcement);
  }
}
