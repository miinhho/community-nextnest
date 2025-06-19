import { PageMeta } from '@/lib/types/page.types';
import { AxiosResponse } from 'axios';

export interface ApiResponse<T = any, D = any> extends AxiosResponse<T, D> {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ApiPageResponse<T = any, D = any> extends ApiResponse<T, D> {
  meta: PageMeta;
}
