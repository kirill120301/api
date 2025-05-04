import {
  Controller,
  HttpStatus,
  HttpCode,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  UnauthorizedException,
  Param,
  ParseIntPipe,
  Delete,
  Put,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UsersService } from 'src/users/users.service';
import { UpdateUser, User } from 'src/dto/user.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: Record<string, string>,
  ): Promise<{ access_token: string }> {
    return await this.authService.signIn(signInDto.login, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('registrate')
  async registrate(
    @Request() req,
    @Body() registrateDto: Record<string, string>,
  ) {
    const user = await this.userService.findOne(req.user.username);
    if (user.role !== 'admin') throw new UnauthorizedException();

    await this.authService.registrate(
      registrateDto.login,
      registrateDto.password,
    );
  }

  @UseGuards(AuthGuard)
  @Get('user-data')
  async getUserData(@Request() req) {
    const data = await this.userService.findOne(req.user.username);
    return {
      id: data.id,
      login: data.login,
      role: data.role,
    };
  }

  @Get('users/:id')
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const data = await this.userService.findById(id);
    return await {
      id: data.id,
      login: data.login,
      role: data.role,
    };
  }

  @UseGuards(AuthGuard)
  @Get('users')
  async getUsers(@Request() req): Promise<User[]> {
    const user = await this.userService.findOne(req.user.username);
    if (user.role !== 'admin') throw new UnauthorizedException();

    return await this.userService.getAll();
  }

  @UseGuards(AuthGuard)
  @Put('users/:id')
  async updateUser(
    @Request() req,
    @Body() updateUser: UpdateUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = await this.userService.findOne(req.user.username);
    if (user.role !== 'admin') throw new UnauthorizedException();

    const { login, password } = updateUser;
    const { role } = await this.userService.findById(id);
    if (role === 'admin')
      throw new ForbiddenException('Can not change admin profile');
    return await this.userService.update({
      id,
      login,
      password,
      role,
    });
  }

  @UseGuards(AuthGuard)
  @Delete('users/:id')
  async deleteUser(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(req.user.username);
    if (user.role !== 'admin') throw new UnauthorizedException();

    return await this.authService.delete(id);
  }
}
