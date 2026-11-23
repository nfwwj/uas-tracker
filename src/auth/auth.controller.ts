import { Controller, Post, UseGuards, Body, Get, Cookies, Res, Req, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginUserDTO, AuthUser } from './dto/auth.dto.js';
import type { Request, Response } from 'express'
import { HttpAdapterHost } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { OptionalJwtAuthGuard } from './jwt.strategy.js';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Throttle } from '@nestjs/throttler';

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService,
              private readonly adapterHost: HttpAdapterHost){}
  
  @Throttle({ default: { limit: 3, ttl: 1000 * 60} })
  @Post('login')
  async login(@Body() data: LoginUserDTO,
              @Res({passthrough:true}) res: unknown) {

    const {accessToken, username, userId} = await this.authService.login(data);
    this.adapterHost.httpAdapter.setCookie(res, 'accessToken', accessToken, {
      httpOnly: true,     
      secure: true,        
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'none',
      maxAge: 60 * 60 * 12, 
      path: "/api"
    });
    return {username, userId}
     

  }
  @UseGuards(OptionalJwtAuthGuard)
  @Get("me")
  async getMe(@Req() req:{user:AuthUser | null}){ //user property only attached after validate in jwt auth guard runs
    if (req.user){
      return {user: {userId: req.user.userId, username: req.user.username} }
    }
    return {user: null}
  }

  // @Post('refresh')
  // async refresh(@Cookies("refreshToken") refreshToken: string){
  //   if (!refreshToken){
  //     throw new UnauthorizedException("Missing cookie.")
  //   }
  //   const accessToken = await this.authService.refreshAccessToken(refreshToken)
  //   return {accessToken}

  // }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('logout')
  async logout(@Req() req:{user:AuthUser}, @Res({ passthrough: true }) res: unknown){ //?
      if (req.user) await this.authService.logout(req.user.sid)   

      this.adapterHost.httpAdapter.clearCookie(res, 'accessToken', { path: '/api' })
    
}
}
