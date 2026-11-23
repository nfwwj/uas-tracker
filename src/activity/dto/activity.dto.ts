import { IsISO8601, IsNotEmpty, IsString, ArrayMaxSize, ArrayNotEmpty, IsArray, IsInt, IsNumber, Matches, MaxLength  } from 'class-validator';

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

const MREF = /^M\d{9}$/

export class TakeNotamDTO {
  @IsArray() @ArrayNotEmpty() @IsInt({ each: true })
  ids: number[];

  @IsString() @Matches(MREF)
  mref: string;

  @IsString() @MaxLength(10)
  takenBy: string;
}

export class CancelNotamDTO {
  @IsString()
  mref: string;
}

export class EditNotamDTO{
  @IsNumber() @IsNotEmpty()
  permitId: number

  @IsString() @Matches(MREF)
  newMref: string

  @IsString() @Matches(MREF)
  oldMref: string
}
