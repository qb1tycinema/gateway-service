import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SendOtpReguest } from './dto';

@Controller('auth')
export class AuthController {

  @Post("otp/send")
  @HttpCode(HttpStatus.OK)
  public async sendOtp(@Body() dto: SendOtpReguest) {
    console.log("DATA: ", dto)

    return { ok: true }
  }
}
