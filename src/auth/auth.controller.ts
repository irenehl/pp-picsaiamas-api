import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { Prisma, User } from '@prisma/client';
import { TokenDto } from './dto/token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: LoginDto & { user: Omit<User, 'password'> },
  ): Promise<TokenDto> {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(
    @Body() req: Prisma.UserCreateInput,
  ): Promise<Omit<User, 'password'>> {
    return this.authService.register(req);
  }
}
