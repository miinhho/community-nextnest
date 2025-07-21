'use client';

import { fetchQueue } from '@/lib/fetch-queue';
import { PageMeta } from '@/lib/types/page.types';
import { recursiveDateParse } from '@/lib/utils/parsing';
import { tokenUtils } from '@/lib/utils/token';
import axios, { AxiosResponse, HttpStatusCode } from 'axios';

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

fetcher.interceptors.request.use((config) => {
  const token = localStorage.getItem('access-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

fetcher.interceptors.response.use(
  (response) => {
    response.data = recursiveDateParse(response.data);
    return response;
  },
  async (error) => {
    const requestInfo = error.config;
    const status = error.response?.status;
    const message = error.response.message || 'An error occurred';

    // TODO : 에러 페이지로 리다이렉트
    switch (status) {
      case HttpStatusCode.Unauthorized: {
        if (fetchQueue.isRefreshing) {
          try {
            const token = await fetchQueue.addToQueue();
            requestInfo.headers.Authorization = `Bearer ${token}`;
            return fetcher(requestInfo);
          } catch (err) {
            return Promise.reject(err);
          }
        }
        fetchQueue.startRefreshing();

        try {
          const response = await axios.post(
            '/api/auth/refresh',
            {},
            {
              withCredentials: true,
            },
          );

          if (response.data.success) {
            const { accessToken } = response.data.data;
            if (!accessToken) {
              throw new Error('Access token is missing from response');
            }

            tokenUtils.set(accessToken);
            fetchQueue.resolveQueue(accessToken);
            requestInfo.headers.Authorization = `Bearer ${accessToken}`;
            return fetcher(requestInfo);
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (err) {
          fetchQueue.rejectQueue(err);
          tokenUtils.remove();

          alert('로그인이 필요합니다. 다시 로그인 해주세요.');
          window.location.href = '/login';
          return Promise.reject(err);
        } finally {
          fetchQueue.finishRefreshing();
        }
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
