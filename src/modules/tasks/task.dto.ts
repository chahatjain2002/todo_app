import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Pager } from '../../dto/pager.dto';
export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @MinLength(5)
  @IsNotEmpty({
    message: 'Task name is required',
  })
  title: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @IsNotEmpty({
    message: 'Task description is required',
  })
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'Task priority is required',
  })
  priority: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  status: boolean;

  @ApiProperty()
  @IsDateString()
  dueDate: string;
}

export class TaskDto {
  @ApiResponseProperty()
  title: string;

  @ApiResponseProperty()
  description: string;

  @ApiResponseProperty()
  priority: string;

  @ApiResponseProperty()
  status: boolean;

  @ApiResponseProperty()
  dueDate: string;
}

export class UpdateTaskDto {
  @ApiProperty()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsOptional()
  priority: string;

  @ApiProperty()
  @IsOptional()
  status: boolean;

  @ApiProperty()
  @IsOptional()
  dueDate: string;
}

export class GetAllTasksResponseDto {
  @ApiResponseProperty()
  tasks: TaskDto[];

  @ApiResponseProperty()
  pager: Pager;
}

export class GetAllTasksDto {
  @ApiResponseProperty()
  tasks: FilterTaskDto[];

  @ApiResponseProperty()
  pager: Pager;
}

export class FilterTaskDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  priority: string;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  dueDate: 'ASC' | 'DESC';
}
export class FindIdDto {
  @ApiProperty()
  id: number;
}
