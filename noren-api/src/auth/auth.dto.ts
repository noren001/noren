import {
  IsMobilePhone,
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';

export class SendOtpDto {
  @IsString()
  @Matches(/^(\+98|0)?9\d{9}$/, { message: 'شماره موبایل معتبر نیست (مثال: 09123456789 یا +989123456789)' })
  mobile: string;
}

export class VerifyOtpDto {
  @IsString()
  @Matches(/^(\+98|0)?9\d{9}$/, { message: 'شماره موبایل معتبر نیست' })
  mobile: string;

  @IsString()
  @Length(6, 6, { message: 'کد تایید باید ۶ رقمی باشد' })
  code: string;
}

export class CompleteProfileDto {
  @IsString()
  @Matches(/^(\+98|0)?9\d{9}$/, { message: 'شماره موبایل معتبر نیست' })
  mobile: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(6, { message: 'رمز عبور حداقل ۶ کاراکتر' })
  password: string;
}

export class LoginWithPasswordDto {
  @IsString()
  @Matches(/^(\+98|0)?9\d{9}$/, { message: 'شماره موبایل معتبر نیست' })
  mobile: string;

  @IsString()
  password: string;
}

export class SetPasswordDto {
  @IsString()
  @Matches(/^(\+98|0)?9\d{9}$/, { message: 'شماره موبایل معتبر نیست' })
  mobile: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdateIncompleteProfileDto {
  @IsString()
  @Matches(/^(\+98|0)?9\d{9}$/, { message: 'شماره موبایل معتبر نیست' })
  mobile: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}