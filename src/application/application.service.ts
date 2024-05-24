import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Application, ApplicationAdd } from 'src/dto/application.dto';
import { TicketService } from 'src/ticket/ticket.service';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly ticketService: TicketService,
  ) {}

  async onModuleInit() {
    console.log(
      'ApplicationService',
      await this.databaseService.application.findMany(),
    );
  }

  async addAndBindTicket(application: ApplicationAdd, ticketId: number) {
    const applicationData = await this.add(application);
    await this.ticketService.subscribeOnApplication(
      ticketId,
      applicationData.id,
    );
  }

  private async add(application: ApplicationAdd): Promise<Application> {
    const { senderId, description, specialist } = application;
    return (await this.databaseService.application.create({
      data: {
        senderId,
        description,
        specialist,
      },
    })) as Application;
  }
}
