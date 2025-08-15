import { IsOptional, IsBooleanString, IsNumberString, IsString } from 'class-validator';

export class QueryPostsDto {
  @IsOptional()
  @IsNumberString()
  authorId?: string;

  @IsOptional()
  @IsBooleanString()
  published?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  search?: string; // 🔍 búsqueda de texto
}
