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
import { Response, Request } from 'express';
import { isEmpty } from 'lodash';

import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserSignUpDTO } from './dto/userSignUp.dto';
import { UserLoginDTO } from './dto/userLogin.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/info')
  public async getInfo(
    // TODO: ???
    @Query() query: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (isEmpty(query)) {
      throw new BadRequestException();
    }

    const { userId, email } = query;
    const user = await this.userService.getInfo(userId, email);

    return res.json(user).status(HttpStatus.OK);
  }

  @Post('login')
  public async login(@Body() body: UserLoginDTO, @Res() res: Response) {
    const validateUser = await this.userService.login(body);

    return res.json(validateUser).status(HttpStatus.OK);
  }

  @Post('sign-up')
  public async signUp(@Body() body: UserSignUpDTO, @Res() res: Response) {
    const user = await this.userService.signUp(body);

    return res.json(user).status(HttpStatus.CREATED);
  }
}
