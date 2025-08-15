import { Controller, Post, Body, ForbiddenException, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto/login.dto';
import { Request, Response } from 'express';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(loginDto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // Cambia a true si usas HTTPS
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.usersService.removeRefreshToken((req.user as User).id);
    res.clearCookie('refreshToken', { path: '/auth/refresh' });

    return {
      message: 'Logout successful. Refresh token cookie cleared.',
    };
  }

  @Public()
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const oldToken = req.cookies['refreshToken'];
    const { accessToken, refreshToken: newToken } = await this.authService.refreshAccessToken(
      String(oldToken),
    );

    // 🔁 Rotar la cookie: borrar vieja y setear nueva
    res.cookie('refreshToken', newToken, {
      httpOnly: true,
      secure: false, // true en producción con HTTPS
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }
}
