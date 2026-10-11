import { IsISO8601, IsNotEmpty, IsString, ArrayMaxSize, ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class CreateActivityDTO {
  // mref, takenBy not included because empty by default
  // status not included because "N" by default
  // permitI??

  @IsString() @IsNotEmpty()
  activityDate: string; // "30 May 2026"

  @IsString() @IsNotEmpty()
  activityTime: string;

  @IsISO8601({ strict: true })
  activityDateTime: string;
}

export class TakeNotamDTO {
  @IsArray() @ArrayNotEmpty() @IsInt({ each: true })
  ids: number[];

  @IsString() @IsNotEmpty()
  mref: string;

  @IsString() @IsNotEmpty()
  takenBy: string;
}

export class CancelNotamDTO {
  @IsString() @IsNotEmpty()
  mref: string;
}
