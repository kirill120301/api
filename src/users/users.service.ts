import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from 'src/dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async onModuleInit() {
    if (!this.findOne('admin')) {
      this.add({
        login: 'admin',
        password: 'admin',
        role: 'admin',
      } as User);
    }
    console.log('UsersService', await this.databaseService.user.findMany());
  }

  async findOne(login: string): Promise<User> {
    return (await this.databaseService.user.findFirst({
      where: {
        login: login,
      },
    })) as User;
  }

  async add(user: User) {
    await this.databaseService.user.create({
      data: {
        login: user.login,
        password: user.password,
        role: user.role,
      },
    });
  }

  async update(user: User) {
    await this.databaseService.user.update({
      where: { id: user.id },
      data: {
        login: user.login,
        password: user.password,
        role: user.role,
      },
    });
  }

  async findById(id: number): Promise<User> {
    return (await this.databaseService.user.findFirst({
      where: {
        id,
      },
    })) as User;
  }

  async getAll(): Promise<User[]> {
    return (await this.databaseService.user.findMany()) as User[];
  }

  async deleteWithApplications(id: number) {
    this.databaseService.application.deleteMany({
      where: {
        senderId: id,
      },
    });
    return await this.databaseService.user.delete({
      where: {
        id,
      },
    });
  }
}
