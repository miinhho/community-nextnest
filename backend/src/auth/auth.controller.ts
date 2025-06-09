import { AuthService } from '@/auth/auth.service';
import { LocalAuthGuard } from '@/auth/guard/local.guard';
import { Public } from '@/auth/public.decorator';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('signup')
  register(@Body() req) {
    return this.authService.register(req);
  }

  @Post('logout')
  logout(@Request() req) {
    return req.logout();
  }
}
