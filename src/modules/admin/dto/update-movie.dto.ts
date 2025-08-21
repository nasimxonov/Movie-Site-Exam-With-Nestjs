import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateMovieDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['free', 'premium'])
  subscriptionType?: 'free' | 'premium';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  category_ids?: string[];
}
