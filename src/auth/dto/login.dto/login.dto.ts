import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 100)
  @Matches(/^(?=.*[A-Z])(?=.*\d).*$/, {
    message: 'Password must contain at least one uppercase letter and one number',
  })
  password: string;
}
