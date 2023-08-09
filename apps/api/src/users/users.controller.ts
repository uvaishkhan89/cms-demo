import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_ROLES } from '../common/constants/user.constant';
import { Roles } from '../jwt/jwt.guard';
import { JoiValidationPipe } from '../common/utils/joi-validation.pipe';
import { profileValidation } from '../common/utils/validations.joi';

@Controller('users')
@Roles(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(profileValidation))
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  // @Post('forget')
  // async forgetPassword(@Body('email') email: string): Promise<{ message: string }> {
  //   const resetToken = await this.usersService.generateResetToken(email);
  //   // Send the resetToken via email (you should implement this)
  //   return { message: 'Password reset token sent successfully' };
  // }

  // @Post('reset')
  // async resetPassword(@Body() body: { email: string, token: string, newPassword: string }): Promise<{ message: string }> {
  //   await this.usersService.resetPassword(body.email, body.token, body.newPassword);
  //   return { message: 'Password reset successfully' };
  // }
}
