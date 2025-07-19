import { IsNotEmpty, IsString } from 'class-validator';

export class UserReqDto {
  @IsNotEmpty()
  @IsString()
  query: string;
}
