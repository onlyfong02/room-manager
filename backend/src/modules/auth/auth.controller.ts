import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from '@modules/auth/auth.service';
import { RegisterDto, LoginDto } from '@modules/auth/dto/auth.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    logout(@CurrentUser() user: any) {
        return this.authService.logout(user.userId);
    }

    @Post('refresh')
    @UseGuards(JwtAuthGuard)
    refreshTokens(@CurrentUser() user: any, @Body('refreshToken') refreshToken: string) {
        return this.authService.refreshTokens(user.userId, refreshToken);
    }
}
