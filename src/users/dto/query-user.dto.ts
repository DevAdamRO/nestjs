import { IsOptional, IsEnum, IsBooleanString, IsNumberString } from 'class-validator';
import { UserRole } from './create-user.dto';

export class QueryUsersDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBooleanString()
  isActive?: string;
}
