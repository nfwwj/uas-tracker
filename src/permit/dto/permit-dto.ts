
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator';
import { CreateActivityDTO } from '../../activity/dto/activity.dto';

export class CreatePermitDTO {
  @IsString() @IsNotEmpty()
  permitNo: string;

  @IsString() @IsNotEmpty()
  applicationNum: string;

  @IsInt() @Min(0)
  altitudeFt: number;

  @IsInt()
  class: number;

  @IsString() @IsNotEmpty()
  fullText: string;

  // activity records checked, together with permit, in a single POST request, to avoid any 
  // complexity with partial failures, and not deal with transactions.
  @IsArray() @ArrayNotEmpty()
  @Type(() => CreateActivityDTO)
  @ValidateNested({ each: true })
  activities: CreateActivityDTO[]; // type annotation, not required but keep for intelliSense
}

export class ParsePermitDTO{
  @IsString() @IsNotEmpty()
  text: string
}

