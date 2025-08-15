import { IsOptional, IsString, IsPhoneNumber } from 'class-validator';

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsPhoneNumber('CL', { message: 'Número inválido para Chile' }) // Puedes cambiar la región
  phone?: string;
}
