import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  Application,
  ApplicationAdd,
  ApplicationChange,
} from 'src/dto/application.dto';
import { UsersService } from 'src/users/users.service';
import { ApplicationService } from './application.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('applications')
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAll(@Request() req) {
    const user = await this.userService.findOne(req.user.username);
    if (user.role !== 'admin') throw new UnauthorizedException();
    return await this.applicationService.get();
  }

  @Get('my')
  @UseGuards(AuthGuard)
  async getMy(@Request() req) {
    const user = await this.userService.findOne(req.user.username);
    if (user.role !== 'user') throw new UnauthorizedException();
    return await this.applicationService.getBySenderId(user.id);
  }

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

  @Put('/:applicationId')
  @UseGuards(AuthGuard)
  async change(
    @Param('applicationId', ParseIntPipe) id: number,
    @Body() applicationChange: ApplicationChange,
    @Request() req,
  ): Promise<Application> {
    const user = await this.userService.findOne(req.user.username);
    if (user.role !== 'admin') throw new UnauthorizedException();

    applicationChange.id = id;
    switch (applicationChange.status) {
      case 'open':
        break;
      case 'inProcess':
        break;
      case 'closed':
        break;
      case 'refused':
        if (!applicationChange.refusedDescription) {
          throw new ForbiddenException();
        }
        break;
      default:
        throw new ForbiddenException();
    }

    return await this.applicationService.change(applicationChange);
  }
}
