import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { UsersService } from 'src/users/users.service';
import { Ticket } from 'src/dto/tiket.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('tickets')
@UseGuards(AuthGuard)
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly userService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async get() {
    return await this.ticketService.getTickets();
  }

  @HttpCode(HttpStatus.OK)
  @Post('/:date')
  async add(@Request() req, @Param('date') date: string) {
    const user = await this.userService.findOne(req.user.username);
    if (user.role !== 'admin') throw new UnauthorizedException();
    const parseDate = new Date(date);
    await this.ticketService.addTicket({
      date: parseDate,
      userId: user.id,
    } as Ticket);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  async delete(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(req.user.username);
    if (user.role !== 'admin') throw new UnauthorizedException();
    return await this.ticketService.deleteTicket(id);
  }
}
