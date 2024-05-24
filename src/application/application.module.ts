import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TicketModule } from 'src/ticket/ticket.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [ApplicationService],
  controllers: [ApplicationController],
  imports: [TicketModule, DatabaseModule, UsersModule],
  exports: [ApplicationService],
})
export class ApplicationModule {}
