import {Controller, Get, HttpCode} from '@nestjs/common';
import {  SkipThrottle } from '@nestjs/throttler';

@Controller('health')
export class HealthController {
//   constructor(private readonly permitService: PermitService) {}

    @SkipThrottle()
    @Get()
    @HttpCode(200)
    async healthCheck() {
        return 
    }
}