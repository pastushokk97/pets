import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Post,
  Req,
  Param,
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

  @UseGuards(AuthGuard)
  @Delete('/:announcementId')
  public async deleteAnnouncement(
    @Req() req: IAuthenticateReq,
    @Param('announcementId') announcementId,
    @Res() res: Response,
  ) {
    const { userId } = req.user;
    await this.announcementService.deleteAnnouncement(announcementId, userId);
    return res.status(HttpStatus.OK).json();
  }
}
