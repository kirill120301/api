import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/dto/user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user: User = await this.userService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const playload = { sub: user.id, username: user.login };
    return {
      access_token: await this.jwtService.signAsync(playload),
    };
  }

  async registrate(username: string, pass: string) {
    await this.userService.add({
      login: username,
      password: pass,
      role: 'user',
    } as User);
  }
}
