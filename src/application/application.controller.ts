import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApplicationAdd } from 'src/dto/application.dto';
import { UsersService } from 'src/users/users.service';
import { ApplicationService } from './application.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('applications')
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly userService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('/:ticketId')
  @UseGuards(AuthGuard)
  async subscribeToTicket(
    @Param('ticketId', ParseIntPipe) id: number,
    @Body() applicationAdd: ApplicationAdd,
    @Request() req,
  ) {
    const user = await this.userService.findOne(req.user.username);
    if (user.role !== 'user') throw new UnauthorizedException();
    applicationAdd.senderId = user.id;
    await this.applicationService.addAndBindTicket(applicationAdd, id);
  }
}
