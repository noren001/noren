import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { User, AuthMethod, UserRole } from '../users/user.entity';
import { OtpService } from './otp.service';
import {
  SendOtpDto,
  VerifyOtpDto,
  CompleteProfileDto,
  LoginWithPasswordDto,
  SetPasswordDto,
  UpdateIncompleteProfileDto,
} from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    const { mobile } = dto;

    const { code } = await this.otpService.generateOtp(mobile);

    const user = await this.userRepo.findOne({ where: { mobile } });

    return {
      success: true,
      message: 'کد تایید ارسال شد',
      devCode: code,
      data: {
        isNewUser: !user,
        isProfileComplete: user?.isProfileComplete || false,
        hasPassword: !!user?.password,
        authMethod: user?.authMethod || 'otp',
      },
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { mobile, code } = dto;

    const isValid = await this.otpService.verifyOtp(mobile, code);
    if (!isValid) {
      throw new BadRequestException('کد تایید نامعتبر یا منقضی شده');
    }

    const user = await this.userRepo.findOne({ where: { mobile } });

    if (!user) {
      const tempToken = crypto.randomUUID();
      await this.otpService.setTempToken(mobile, tempToken);

      return {
        success: true,
        step: 'complete_profile',
        tempToken,
        message: 'لطفاً اطلاعات خود را تکمیل کنید',
      };
    }

    if (!user.isProfileComplete) {
      const tempToken = crypto.randomUUID();
      await this.otpService.setTempToken(mobile, tempToken);

      return {
        success: true,
        step: 'complete_profile',
        tempToken,
        message: 'لطفاً اطلاعات ناقص خود را تکمیل کنید',
        existingData: {
          name: user.name || '',
          email: user.email || '',
        },
      };
    }

    if (user.authMethod === AuthMethod.OTP || !user.password) {
      const token = this.generateToken(user);
      return {
        success: true,
        step: 'logged_in',
        token,
        user: this.sanitizeUser(user),
        suggestSetPassword: true,
      };
    }

    const tempToken = crypto.randomUUID();
    await this.otpService.setTempToken(mobile, tempToken);

    return {
      success: true,
      step: 'enter_password',
      tempToken,
      message: 'لطفاً رمز عبور خود را وارد کنید',
    };
  }

  async completeProfile(dto: CompleteProfileDto) {
    const { mobile, name, email, password } = dto;

    const existing = await this.userRepo.findOne({ where: { mobile } });
    if (existing) {
      throw new ConflictException('این شماره قبلاً ثبت شده');
    }

    if (email) {
      const emailExists = await this.userRepo.findOne({ where: { email } });
      if (emailExists) {
        throw new ConflictException('این ایمیل قبلاً استفاده شده');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const referralCode = this.generateReferralCode();

    const user = new User();
    user.mobile = mobile;
    user.name = name;
    user.email = email || null;
    user.password = hashedPassword;
    user.authMethod = AuthMethod.PASSWORD;
    user.isProfileComplete = true;
    user.referralCode = referralCode;
    user.walletBalance = 0;
    user.role = UserRole.USER;

    await this.userRepo.save(user);
    const token = this.generateToken(user);

    return {
      success: true,
      token,
      user: this.sanitizeUser(user),
    };
  }

  async updateIncompleteProfile(dto: UpdateIncompleteProfileDto) {
    const { mobile, name, email } = dto;
    const user = await this.userRepo.findOne({ where: { mobile } });
    if (!user) throw new BadRequestException('کاربر یافت نشد');

    user.name = name;
    user.email = email || user.email;
    user.isProfileComplete = true;

    await this.userRepo.save(user);
    const token = this.generateToken(user);

    return {
      success: true,
      token,
      user: this.sanitizeUser(user),
    };
  }

  async loginWithPassword(dto: LoginWithPasswordDto) {
    const { mobile, password } = dto;
    const user = await this.userRepo.findOne({ where: { mobile } });

    if (!user || !user.password) {
      throw new UnauthorizedException('شماره یا رمز عبور اشتباه');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('شماره یا رمز عبور اشتباه');
    }

    const token = this.generateToken(user);
    return {
      success: true,
      token,
      user: this.sanitizeUser(user),
    };
  }

  async setPassword(dto: SetPasswordDto) {
    const { mobile, password } = dto;
    const user = await this.userRepo.findOne({ where: { mobile } });
    if (!user) throw new BadRequestException('کاربر یافت نشد');

    user.password = await bcrypt.hash(password, 12);
    user.authMethod = AuthMethod.PASSWORD;
    await this.userRepo.save(user);

    return { success: true, message: 'رمز عبور با موفقیت تنظیم شد' };
  }

  async getProfile(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return this.sanitizeUser(user);
  }

  private generateToken(user: User): string {
    const payload = { sub: user.id, mobile: user.mobile, role: user.role };
    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: User) {
    const { password, ...safe } = user;
    return safe;
  }

  private generateReferralCode(): string {
    return 'NRN' + crypto.randomBytes(3).toString('hex').toUpperCase();
  }
}