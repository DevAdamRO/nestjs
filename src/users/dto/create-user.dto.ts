import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsEnum,
  IsDateString,
  Length,
  Matches,
  IsNumberString,
} from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 100)
  @Matches(/^(?=.*[A-Z])(?=.*\d).*$/, {
    message: 'Password must contain at least one uppercase letter and one number',
  })
  password: string;

  @IsInt()
  @Min(0)
  @Max(120)
  age: number;

  @IsEnum(UserRole)
  role: UserRole;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
