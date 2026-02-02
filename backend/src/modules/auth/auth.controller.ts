import { CurrentUser } from '@common/decorators/current-user.decorator';
import { AuthService } from '@modules/auth/auth.service';
import { LoginDto, RegisterDto } from '@modules/auth/dto/auth.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @Throttle({ default: { limit: 10, ttl: 15000 } }) // Stricter: 10 requests per 60 seconds
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @Throttle({ default: { limit: 10, ttl: 15000 } }) // Stricter: 10 requests per 60 seconds
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    logout(@CurrentUser() user: any) {
        return this.authService.logout(user.userId);
    }

    @Post('refresh')
    refreshTokens(@Body('refreshToken') refreshToken: string) {
        return this.authService.refreshTokens(refreshToken);
    }
}
