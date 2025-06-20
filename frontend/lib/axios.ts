/* eslint-disable @typescript-eslint/no-explicit-any */
import { PageMeta } from '@/lib/types/page.types';
import { recursiveDateParse } from '@/lib/utils';
import axios, { AxiosResponse } from 'axios';

interface ApiResponse<T = any, D = any> extends AxiosResponse<T, D> {
  success: boolean;
  message?: string;
  error?: string;
  meta?: PageMeta;
}

export const fetcher = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 5000,
  withCredentials: true,
});

fetcher.interceptors.response.use((response) => {
  response.data = recursiveDateParse(response.data);
  return response;
});

export const apiGet = <T>(url: string) => fetcher.get<T, ApiResponse<T>>(url);
export const apiPost = <T>(url: string, data?: any) => fetcher.post<T, ApiResponse<T>>(url, data);
export const apiDelete = <T>(url: string) => fetcher.delete<T, ApiResponse<T>>(url);
export const apiPut = <T>(url: string, data?: any) => fetcher.put<T, ApiResponse<T>>(url, data);
export const apiPatch = <T>(url: string, data?: any) => fetcher.patch<T, ApiResponse<T>>(url, data);
