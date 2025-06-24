import { apiPost } from '@/lib/axios';
import { Role } from '@/lib/types/role.types';
import { useMutation } from '@tanstack/react-query';

// Auth Register Query
export interface AuthRegisterBody {
  email: string;
  password: string;
  name: string;
}
export interface AuthRegisterData {
  id: string;
  role: Role;
  accessToken: string;
}
export const authRegisterQueryFn = async (params: AuthRegisterBody) => {
  const response = await apiPost<AuthRegisterData>('auth/register', params);
  return response.data;
};
export const useAuthRegisterQuery = () =>
  useMutation({
    mutationFn: (params: AuthRegisterBody) => authRegisterQueryFn(params),
  });

// Auth Login Query
export interface AuthLoginBody {
  email: string;
  password: string;
}
export interface AuthLoginData {
  id: string;
  role: Role;
  accessToken: string;
}
export const authLoginQueryFn = async (params: AuthLoginBody) => {
  const response = await apiPost<AuthLoginData>('auth/login', params);
  return response.data;
};
export const useAuthLoginQuery = () =>
  useMutation({
    mutationFn: (params: AuthLoginBody) => authLoginQueryFn(params),
  });

// Auth Logout Query
export const authLogoutQueryFn = async () => {
  await apiPost('auth/logout');
};
export const useAuthLogoutQuery = () =>
  useMutation({
    mutationFn: () => authLogoutQueryFn(),
  });

// Auth token refresh Query
interface AuthRefreshData {
  accessToken: string;
}
export const authRefreshQueryFn = async () => {
  const response = await apiPost<AuthRefreshData>('auth/refresh');
  return response.data;
};
export const useAuthRefreshQuery = () =>
  useMutation({
    mutationFn: () => authRefreshQueryFn(),
  });
