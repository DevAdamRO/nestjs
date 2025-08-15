import { IsString, IsOptional, IsBoolean, IsNotEmpty, IsArray, IsInt } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  // Campo para el nombre o URL de la imagen
  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categories?: number[];
}
