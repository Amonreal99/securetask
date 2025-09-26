import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthService } from '../auth/auth.service';
import { Users } from './user.interface';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService) { }

  @Post('signup')
  async signup(@Body() body: { username: string; email: string; password: string; role?: string }) {
    return this.userService.signup({
      username: body.username,
      email: body.email,
      password: body.password,
      role: body.role ?? 'viewer',
    });
  }


  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.userService.login(body.email, body.password);
  }


  @Post('verify')
  async verify(@Body() body: { email: string; code: string }) {
    return this.userService.verifyEmail(body.email, body.code);
  }

  @UseGuards(JwtAuthGuard)
  @Post('changePassword')
  async changePassword(
    @Request() req,
    @Body() body: { currentPassword: string; newPassword: string }
  ) {
    return this.userService.changePassword(
      req.user.id,
      body.currentPassword,
      body.newPassword
    );
  }

  @Post('forgotPassword')
  async forgotPassword(@Body() body: { email: string }) {
    return this.userService.forgotPassword(body.email);
  }


  @Post('resetPassword')
  async resetPassword(@Body() body: { email: string; code: string; newPassword: string }) {
    return this.userService.resetPassword(body.email, body.code, body.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return this.userService.findById(req.user.id);
  }
}



