import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Profile } from '@models/profile.model';

@Injectable()
export class UsersService {

  constructor(@InjectModel(Profile) private readonly profile: typeof Profile){}

  create(createUserDto: CreateUserDto) {
    return this.profile.create({...createUserDto});
  }

  findAll() {
    return this.profile.findAll();
  }

  findOne(id: number) {
    return this.profile.findByPk(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.profile.update(updateUserDto, {
      where: { id }
    });
  }

  remove(id: number) {
    return this.profile.destroy({
      where: { id },
      force: true
    });
  }

  // findOneByEmail(email) {
  //   return this.user.findOne({
  //     where: { email }
  //     attributes: [
  //       'id',
  //       'email',
  //       'firstName',
  //       'lastName',
  //       'password',
  //     ],
  //   });
  // }

  // async resetPassword(id, updatePasswordUserDto: UpdatePasswordUserDto){
  //   const { oldPassword, newPassword, confirmPassword } = updatePasswordUserDto;
  //   const user = await this.user.findByPk(id)
  //   if(user && oldPassword == user.password){
  //     if(newPassword == confirmPassword){
  //       user.password = newPassword
  //       // this.user.update(user);
  //       await this.user.update(
  //         { password: user.password },
  //         { where: { id: id } }
  //       );
  //       return 'Password Change Successfully';
  //     }else{
  //       throw new NotFoundException('Password not match');
  //     }
  //   }else{
  //     throw new NotFoundException('Enter correct password');
  //   }
  // }

  // public async generateResetToken(email: string): Promise<string> {
  //   // Generate a unique token, save it in the database, and return it
  //   const resetToken = uuidv4();
  //   const user = await User.findOne({ where: { email } });
  //   if (!user) {
  //     throw new Error('User not found');
  //   }

  //   user.resetToken = resetToken;
  //   user.resetTokenExpiration = Date.now() + 3600000; // Set expiration to 1 hour from now
  //   await user.save();

  //   return resetToken;
  // }

  // public async resetPassword(email: string, token: string, newPassword: string): Promise<void> {
  //   // Find the user by email and ensure the token is valid and not expired
  //   const user = await User.findOne({ where: { email } });
  //   if (!user || user.resetToken !== token || user.resetTokenExpiration < Date.now()) {
  //     throw new Error('Invalid or expired reset token');
  //   }

  //   // Update the user's password and reset the resetToken fields
  //   user.password = newPassword;
  //   user.resetToken = null;
  //   user.resetTokenExpiration = null;
  //   await user.save();
  // }

  // async findUserByEmail(email: string) {
  //   const userEmail = await this.user.findOne({
  //     where: {
  //         email: email,
  //     }
  //   }); 
  //   if(userEmail)
  //     return userEmail;
  //   else
  //     throw new NotFoundException('Email not found');
  // }

  // async updatePassword(id, newPassword) {
  //   const user = await this.user.findByPk(id);
  //   user.password = newPassword;
  //   return this.user.update({ password: user.password }, { where: { id } });
  // }
}
