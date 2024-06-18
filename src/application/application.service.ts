import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  Application,
  ApplicationAdd,
  ApplicationChange,
} from 'src/dto/application.dto';
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

  async get(): Promise<Application[]> {
    return (await this.databaseService.application.findMany()) as Application[];
  }

  async getBySenderId(senderId: number): Promise<Application[]> {
    return (await this.databaseService.application.findMany({
      where: {
        senderId,
      },
    })) as Application[];
  }

  async addAndBindTicket(application: ApplicationAdd, ticketId: number) {
    const applicationData = await this.add(application);
    await this.ticketService.subscribeOnApplication(
      ticketId,
      applicationData.id,
    );
  }

  private async add(application: ApplicationAdd): Promise<Application> {
    const { senderId, description } = application;
    return (await this.databaseService.application.create({
      data: {
        senderId,
        description,
      },
    })) as Application;
  }

  async change(application: ApplicationChange): Promise<Application> {
    return (await this.databaseService.application.update({
      where: {
        id: application.id,
      },
      data: {
        status: application.status,
        specialist: application.specialist,
        refusedDescription: application.refusedDescription,
      },
    })) as Application;
  }

  async delete(id: number) {
    return await this.databaseService.application.delete({
      where: {
        id,
      },
    });
  }

  async deleteAllSenderApplications(senderId: number) {
    return await this.databaseService.application.deleteMany({
      where: {
        senderId,
      },
    });
  }
}
