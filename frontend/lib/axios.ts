'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { PageMeta } from '@/lib/types/page.types';
import { recursiveDateParse } from '@/lib/utils';
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
  (error) => {
    const status = error.response.status;
    const message = error.response.message || 'An error occurred';

    // TODO : Handle different HTTP status codes
    switch (status) {
      case HttpStatusCode.Unauthorized: {
        console.error('Unauthorized access:', message);
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
      default: {
        console.error('An error occurred:', message);
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
