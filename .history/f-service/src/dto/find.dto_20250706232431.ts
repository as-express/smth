import { IsNotEmpty } from 'class-validator';

export class FindDto {
  @IsNotEmpty()
  q: string;
}
