import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy, AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.accessToken ?? null, 
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
   
  }

  async validate(payload: { sub: number; username: string; sid: string }) {
    const session = await this.prismaService.session.findUnique({where:{sid: payload.sid},
    include:
    {user:
        {select:
            {disabled:true}}}})

    if (!session || session.expiresAt < new Date()){
        throw new UnauthorizedException('Session expired.')
    }

    if (session.user?.disabled){
        throw new UnauthorizedException('Unauthorized user.')
    }
    return { userId: payload.sub, username: payload.username, sid: payload.sid };
  }
}

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    // user is the .user property, not entire req object. 
    if (!user){
      return null 
    }
    else{
      return user
    }
    
  }
}
