'use client';

import { PageMeta } from '@/lib/types/page.types';
import { recursiveDateParse } from '@/lib/utils/parsing';
import axios, { AxiosResponse, HttpStatusCode } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

interface ApiResponse<T = any, D = any> extends AxiosResponse<T, D> {
  success: boolean;
  message?: string;
  error?: string;
  meta?: PageMeta;
}

export const fetcher = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 5000,
  withCredentials: true,
});

const refreshAuthLogic = async (_failedRequest: any) => {
  await axios.post(
    'api/auth/refresh',
    {},
    {
      withCredentials: true,
    },
  );
  return Promise.resolve();
};

createAuthRefreshInterceptor(fetcher, refreshAuthLogic);

fetcher.interceptors.response.use(
  (response) => {
    response.data = recursiveDateParse(response.data);
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const message = error.response.message || 'An error occurred';

    // TODO : 에러 페이지로 리다이렉트
    switch (status) {
      case HttpStatusCode.Unauthorized: {
        alert('로그인이 필요합니다. 다시 로그인 해주세요.');
        window.location.href = '/login';
        break;
      }
      case HttpStatusCode.Forbidden: {
        console.error('Forbidden access:', message);
        break;
      }
      case HttpStatusCode.NotFound: {
        console.error('Resource not found:', message);
        break;
      }
      case HttpStatusCode.InternalServerError: {
        console.error('Internal server error:', message);
        break;
      }
    }
    return Promise.reject(error);
  },
);

export const apiGet = <T>(url: string) => fetcher.get<T, ApiResponse<T>>(url);
export const apiPost = <T>(url: string, data?: any) => fetcher.post<T, ApiResponse<T>>(url, data);
export const apiDelete = <T>(url: string) => fetcher.delete<T, ApiResponse<T>>(url);
export const apiPut = <T>(url: string, data?: any) => fetcher.put<T, ApiResponse<T>>(url, data);
export const apiPatch = <T>(url: string, data?: any) => fetcher.patch<T, ApiResponse<T>>(url, data);
