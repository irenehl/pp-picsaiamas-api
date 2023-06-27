import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { TokenDto } from './dto/token.dto';
import { Prisma, User } from '@prisma/client';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(dto: LoginDto): Promise<User | null> {
    const user = await this.userService.validate({ email: dto.email });

    if (!user || !(await bcrypt.compare(dto.password, user.password)))
      return null;

    return user;
  }

  async login(dto: Omit<User, 'password'>): Promise<TokenDto> {
    const payload = { email: dto.email, id: dto.id };

    return {
      token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
      }),
    };
  }

  async register(dto: Prisma.UserCreateInput): Promise<Omit<User, 'password'>> {
    return this.userService.create(dto);
  }
}
