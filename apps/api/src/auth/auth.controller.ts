import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, LoginDto, ResetPasswordDto, SendOtpDto, VerifyOtpDto } from './dto/auth.dto';
import { Public } from '../jwt/jwt.guard';
import { JoiValidationPipe } from '../common/utils/joi-validation.pipe';
import { forgotPasswordValidation, loginValidation, resetPasswordValidation, sendOtpValidation, userValidation, verifyOtpValidation } from '../common/utils/validations.joi';
import { CreateRegisterDto } from './dto/auth.dto';
import { Otp } from '@models/otp.model';


@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @UsePipes(new JoiValidationPipe(loginValidation))
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);    
  }


  @Post('register')
  @UsePipes(new JoiValidationPipe(userValidation))
  async register(@Body() createRegisterDto: CreateRegisterDto){
   return this.authService.register(createRegisterDto);
  }

  @Post('resend-otp')
  @UsePipes(new JoiValidationPipe(sendOtpValidation))
  async resendOtp(@Body() sendOtpDto: SendOtpDto){
    return this.authService.resendOtp(sendOtpDto);
  }

  @Post('verify')
  @UsePipes(new JoiValidationPipe(verifyOtpValidation))
  async verify(@Body() verifyOtpDto: VerifyOtpDto){
    return this.authService.verify(verifyOtpDto);
  }
  
  @Post('forgot-password')
  @UsePipes(new JoiValidationPipe(forgotPasswordValidation))
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto){
    console.log('hii controller');
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @UsePipes(new JoiValidationPipe(resetPasswordValidation))
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto){
    return this.authService.resetPassword(resetPasswordDto);
  }
}


