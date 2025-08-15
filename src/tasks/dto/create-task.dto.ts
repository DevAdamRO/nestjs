import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Status } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  content: string;

  @IsEnum(Status, {
    message: `status debe ser uno de los valores: ${Object.values(Status).join(', ')}`,
  })
  @IsOptional()
  status?: Status;
}
