import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [TicketService],
  controllers: [TicketController],
  imports: [DatabaseModule, UsersModule],
  exports: [TicketService],
})
export class TicketModule {}
