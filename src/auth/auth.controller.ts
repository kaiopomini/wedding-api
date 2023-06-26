import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from 'src/common/decorators';
import { RefreshTokenGuard } from 'src/common/guards';
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptor';
import { AuthService } from './auth.service';
import { AuthDto, CreateUserDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/signup')
  @Public()
  @UseInterceptors(FormatResponseInterceptor)
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: CreateUserDto) {
    return this.authService.signupLocal(dto);
  }

  @Post('local/signin')
  @Public()
  @UseInterceptors(FormatResponseInterceptor)
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() dto: AuthDto) {
    return this.authService.signinLocal(dto);
  }

  @Post('logout')
  @ApiBearerAuth('access-token')
  @UseInterceptors(FormatResponseInterceptor)
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: string) {
    return this.authService.logout(userId);
  }

  @Post('refresh')
  @Public() // To avoid AccessTokenGuard and then use RefreshTokenGuard
  @ApiBearerAuth('refresh-token')
  @UseGuards(RefreshTokenGuard)
  @UseInterceptors(FormatResponseInterceptor)
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
