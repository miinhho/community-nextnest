import { IsInt, IsPositive } from 'class-validator';

export class PageQueryDto {
  @IsInt()
  @IsPositive({ message: '페이지 번호는 양수여야 합니다' })
  page: number;
  @IsInt()
  @IsPositive({ message: '페이지 크기는 양수여야 합니다' })
  size: number;
}
