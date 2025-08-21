import { IsString, IsNumber, IsArray, IsEnum, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Type(() => Number)
  release_year: number;

  @IsNumber()
  @Type(() => Number)
  duration_minutes: number;

  @IsEnum(['free', 'premium'])
  subscription_type: 'free' | 'premium';

  @IsArray()
  @IsString({ each: true })
  category_ids: string[];

  @IsString()
  slug: string;

  @IsString()
  created_by_id: string;
}
