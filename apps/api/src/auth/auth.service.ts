import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto, LoginDto, ResetPasswordDto, VerifyOtpDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { User } from '@models/user.model';
import { MESSAGE, RESPONSE, STATUS, USER_ROLES } from '../common/constants/user.constant';
import { checkHash } from '../common/utils';
import { hashSync } from 'bcrypt';
import { CreateRegisterDto } from './dto/auth.dto';
import { SendOtpDto } from './dto/auth.dto';
import { Otp } from '@models/otp.model';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => JwtService)) private readonly jwt: JwtService,
    private config: ConfigService
     ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;    
    const userDetails = await this.authenticateUser(email, password);     
    if (!userDetails)
      throw new NotFoundException({ status: RESPONSE.ERROR, message: MESSAGE.LOGIN.INVALID_CREDENTIALS })
    return  { status: RESPONSE.SUCCESS, message: MESSAGE.LOGIN.SUCCESS, userDetails };
  }

  async register(createRegisterDto: CreateRegisterDto){
    const { first_name, last_name, email, mobile, password, roleId } = createRegisterDto
    const isEmailExist = await User.findOne({ where: { email } });
    if (isEmailExist)
      throw new NotFoundException({ status: RESPONSE.ERROR, message: MESSAGE.USER.EMAIL_EXIST });
    const hashPassword = hashSync(password, 10);
    const userData ={
      first_name: first_name,
      last_name: last_name,
      email: email,
      mobile: mobile,
      password: hashPassword,
      roleId: roleId
    }
  
    const user = await User.create(userData);
    if (user)
      return { status: RESPONSE.SUCCESS, message: MESSAGE.USER.SUCCESS, user };
  }

  async authenticateUser(email: string, password: string) {    
    const user = await User.findOne({
      where: {
        email:email, status:STATUS.ACTIVE
      },
    });
    if (!user)
      return false;
    else {
      if(user.status!=STATUS.ACTIVE) return {status:false}; 
      const isValid = await checkHash(password, user.password);    
      if (isValid) {
        const token = await this.getToken(user);          
        return {data:user,token,status:true};
      } 
      return false;
    }
  }

  
  async generateToken(payload: any): Promise<string> {
    return this.jwt.signAsync(payload);
  }

  private getToken(user) {
    const payload = {       
      user: {
        id: user.id,
        roleId: user.roleId,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      },
    };
    const token: string = this.jwt.sign(payload);  
    return token ;
  }

  async resendOtp(sendOtpDto: SendOtpDto){
    const { email, type } = sendOtpDto;
    console.log(email)
    const isEmail = await User.findOne({
      where: {
        email:email, status:STATUS.ACTIVE
      },
    });
    if(isEmail){
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpSend = await Otp.create({...sendOtpDto, otp});
      if(otpSend)
      return { status: RESPONSE.SUCCESS, message: MESSAGE.USER.OTP_SEND, otp }
    } else
      throw new NotFoundException({ status: RESPONSE.ERROR, message: MESSAGE.USER.EMAIL_NOT_EXIST });
  }

  async verify(verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;
    const user = await Otp.findOne({ 
      where: { email },
      order: [['id', 'DESC']],
    });
    if (!user)
      throw new NotFoundException({ status: RESPONSE.ERROR, message: MESSAGE.USER.EMAIL_NOT_EXIST });
    if (otp != user.otp) {
      throw new NotFoundException({ status: RESPONSE.ERROR, message: MESSAGE.USER.OTP_NOT_MATCH });
    }
    return { status: RESPONSE.SUCCESS, message: MESSAGE.USER.OTP_MATCH };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto){
    const otp = await this.resendOtp(forgotPasswordDto)
    console.log(otp);
    console.log(otp, 'forgotPassword');
    if (otp)
      return { status: RESPONSE.SUCCESS, message: MESSAGE.USER.PASSWORD_SUCCESS, Otp};
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto){
    const { newPassword, otp, email } = resetPasswordDto;
    const user = await User.findOne({
      where: { email:email },
    });
    if (!user)
      throw new NotFoundException({ status: RESPONSE.ERROR, message: MESSAGE.USER.EMAIL_NOT_EXIST });
    const verify = await this.verify(resetPasswordDto)
    const hashPassword = hashSync(newPassword, 10);
    if(verify && user){
      user.password = hashPassword;
      await User.update({ 
        password: user.password },
        { where: { email: email } 
      });
      return { status: RESPONSE.SUCCESS, message: MESSAGE.USER.UPDATE_PASSWORD, user };
    }else{
      throw new NotFoundException({ status: RESPONSE.ERROR, message: MESSAGE.USER.INVALID_CREDENTIAL });
    }
  }
}
