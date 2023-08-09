import { IsEmail, IsEnum, IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { OTP_PURPOSE, OTP_PURPOSE_LIST, USER_ROLES_TYPE } from "../../common/constants/user.constant";

export class LoginDto {
    @IsNotEmpty()
    @IsString()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    password: string;
}

export class CreateRegisterDto {
    @IsString()
    @IsNotEmpty()
    first_name: string;
  
    @IsString()
    last_name: string;
  
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    mobile: string;
  
    @IsString()
    @IsNotEmpty()
    password: string;
  
    @IsNotEmpty()
    @IsNumber()
    roleId: number;
}

export class SendOtpDto {

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsEnum(OTP_PURPOSE_LIST)
    @IsString()
    type: string;
}

export class VerifyOtpDto {
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsNumber()
    otp: number;
}

export class ForgotPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;

    @IsString()
    @IsEnum(OTP_PURPOSE)
    type: string = OTP_PURPOSE.FORGOT_PASSWORD;
}

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;

    @IsNumber()
    otp: number;

    @IsString()
    newPassword:string;
}