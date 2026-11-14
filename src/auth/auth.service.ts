
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDTO } from './dto/auth.dto';
import bcrypt from 'bcrypt';
import * as crypto from "crypto" 

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService
  ) {}

  async login(data: LoginUserDTO) {
    const user = await this.prismaService.user.findUnique({where: {email: data.email}})
    if (!user){
        throw new UnauthorizedException("Invalid email or password.")
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash)

    if (!isMatch){
        throw new UnauthorizedException("Invalid email or password.")
    }

     if (user.disabled){
        throw new UnauthorizedException("Unauthorized user.")
    }

    const { sid } = await this.createSession(user.id) // new sid generated on every log in, to ensure only 1 session
    const accessToken = await this.generateAccessToken(user.id, user.username, sid) //to be stored in JWT + sId

    // return { accessToken, refreshToken }
    return { accessToken, username: user.username, userId: user.id }

  }

  async generateAccessToken(userId: number, username: string, sid: string){
    const payload = { sub: userId, username: username, sid: sid};
    const access_token = await this.jwtService.sign(payload)
    return access_token
  }

  async createSession(userId: number){
    const sid = crypto.randomUUID() // stored in db

    // const refreshToken = crypto.randomBytes(32).toString('hex')
    // const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex') // stored in db

    const refreshTokenHash = null

    const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000) //session valid for 12 hrs

    await this.prismaService.session.upsert({
      where: { userId },
      create: { userId, sid, refreshTokenHash, expiresAt },
      update: { sid, refreshTokenHash, expiresAt, createdAt: new Date() },
    })

    // return {sid, refreshToken}
    return {sid}
  }

  // async refreshAccessToken(refreshToken: string){ //access token expired, cookie sent 
  //   const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex")

  //   //1. session exists ?
  //   const session = await this.prismaService.session.findFirst({ 
  //       where: {refreshTokenHash: hashedToken},
  //       include: {user:{select:{username: true, disabled: true}}}
  //   })

  //   // 2. session still valid?
  //   if (!session || session.expiresAt < new Date() || session.user.disabled ){  
  //           throw new UnauthorizedException("Invalid session.")
  //       }
    
  //   const new_accessToken = await this.generateAccessToken(session.userId, session.user.username, session.sid)
  //   return new_accessToken
  // }

  async logout(sid: string) {
    await this.prismaService.session.deleteMany({ where: { sid: sid } })
}

}
