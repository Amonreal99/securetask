import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';
import { MailerService } from '../mail/mail.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailerService: MailerService,
    private readonly authService: AuthService,) { }


  async signup(userDto: CreateUserDto) {

    const code = Math.floor(100000 + Math.random() * 900000).toString();


    const passwordHash = await this.authService.hashPassword(userDto.password);


    const user = this.userRepository.create({
      ...userDto,
      password_hash: passwordHash,
      verificationCode: code,
      isVerified: false,
    });

    await this.userRepository.save(user);


    await this.mailerService.sendVerificationEmail(user.email, code);

    return { message: 'Verification email sent! Please check your inbox.' };
  }

  async verifyEmail(email: string, code: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new Error('User not found');

    if (user.verificationCode === code) {
      user.isVerified = true;
      user.verificationCode = null;
      await this.userRepository.save(user);
      return { message: 'Email verified successfully' };
    }

    throw new Error('Invalid verification code');
  }
  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new Error('User not found');

    const isMatch = await this.authService.comparePasswords(password, user.password_hash);
    if (!isMatch) throw new Error('Invalid password');

    const token = await this.authService.generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    return { access_token: token };
  }



  async createUser(username: string, email: string, password: string, role: string) {
    const user = this.userRepository.create({ username, email, password_hash: password, role });
    return this.userRepository.save(user);
  }
  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }




  async changePassword(userId: number, currentPassword: string, newPassword: string) {

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');


    const isMatch = await this.authService.comparePasswords(currentPassword, user.password_hash);
    if (!isMatch) throw new Error('Current password is incorrect');


    const newHash = await this.authService.hashPassword(newPassword);


    user.password_hash = newHash;
    await this.userRepository.save(user);

    return { message: 'Password updated successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new Error('User not found');

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.verificationCode = resetCode;
    await this.userRepository.save(user);

    await this.mailerService.sendPasswordResetEmail(user.email, resetCode);

    return { message: 'Password reset code sent to your email' };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new Error('User not found');
    console.log('Expected:', user.verificationCode, 'Provided:', code);

    if (user.verificationCode !== code) {
      throw new Error('Invalid or expired reset code');
    }

    user.password_hash = await this.authService.hashPassword(newPassword);
    user.verificationCode = null; // clear it out
    await this.userRepository.save(user);

    return { message: 'Password reset successfully' };
  }


  async findById(id: number) {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'role', 'isVerified'], // hide password_hash
    });
  }



}



