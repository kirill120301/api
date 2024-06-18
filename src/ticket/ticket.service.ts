import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Ticket } from 'src/dto/tiket.dto';

@Injectable()
export class TicketService {
  constructor(private readonly databaseService: DatabaseService) {}

  async onModuleInit() {
    console.log('TicketService', await this.databaseService.ticket.findMany());
  }

  async addTicket(ticket: Ticket) {
    await this.databaseService.ticket.create({
      data: {
        date: ticket.date,
        userId: ticket.userId,
      },
    });
  }

  async getTickets(): Promise<Ticket[]> {
    return await this.databaseService.ticket.findMany();
  }

  async getTicket(id: number): Promise<Ticket> {
    return await this.databaseService.ticket.findUnique({
      where: {
        id,
      },
    });
  }

  async subscribeOnApplication(ticketId: number, applicationId: number) {
    await this.databaseService.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        applicationId,
      },
    });
  }

  async deleteTicket(ticketId: number) {
    const ticketToDelete = await this.databaseService.ticket.delete({
      where: {
        id: ticketId,
      },
    });
    //await this.applicationsService.delete(ticketToDelete.applicationId);
    return ticketToDelete;
  }
}
