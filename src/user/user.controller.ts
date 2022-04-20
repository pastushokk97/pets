import {
  Controller,
  Post,
  HttpStatus,
  Res,
  UseGuards,
  Body,
  Get,
  Req,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { isEmpty } from 'lodash';

import { UserService } from './user.service';
import { AuthGuard } from '../middlewares/auth/auth.guard';
import { UserSignUpDTO } from './dto/userSignUp.dto';
import { UserLoginDTO } from './dto/userLogin.dto';
import { USER_API } from '../app-constants/routes';
import { IAuthenticateReq } from '../app-constants/types';
import { UserInfoDto } from './dto/userInfo.dto';

@Controller(USER_API)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/info')
  public async getInfo(
    @Query() query: UserInfoDto,
    @Req() req: IAuthenticateReq,
    @Res() res: Response,
  ) {
    if (isEmpty(query)) {
      throw new BadRequestException();
    }
    const { userId, email } = query;
    const user = await this.userService.getInfo(userId, email);

    return res.status(HttpStatus.OK).json(user);
  }

  @Post('login')
  public async login(@Body() body: UserLoginDTO, @Res() res: Response) {
    const validateUser = await this.userService.login(body);

    return res.status(HttpStatus.OK).json(validateUser);
  }

  @Post('sign-up')
  public async signUp(@Body() body: UserSignUpDTO, @Res() res: Response) {
    const user = await this.userService.signUp(body);

    return res.status(HttpStatus.CREATED).json(user);
  }
}
