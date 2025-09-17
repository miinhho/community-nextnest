import { USER_QUERY } from '@/features/user/query/user-key'
import { fetcher } from '@/lib/fetch'
import { recursiveDateParse } from '@/lib/utils/parsing'
import { useMutation, useQuery } from '@tanstack/react-query'

// User Get Query
export const userQueryFn = async (userId: string) => {
  const { data } = await fetcher.GET('/user/{id}', {
    params: { path: { id: userId } },
  })
  return recursiveDateParse(data)
}
export const useUserQuery = (userId: string) =>
  useQuery({
    queryKey: [USER_QUERY.USER, userId],
    queryFn: () => userQueryFn(userId),
  })

// User Patch Query
interface UserPatchParams {
  userId: string
  name: string
  image: string
}
export const userPatchQueryFn = async ({ userId, name, image }: UserPatchParams) => {
  await fetcher.PATCH('/user/{id}', {
    params: { path: { id: userId } },
    body: { name, image },
  })
}
export const useUserPatchQuery = () =>
  useMutation({
    mutationFn: (params: UserPatchParams) => userPatchQueryFn(params),
  })

// User Delete Query
export const userDeleteQueryFn = async (userId: string) => {
  const { data } = await fetcher.DELETE('/user/{id}', {
    params: { path: { id: userId } },
  })
  return data
}
export const useUserDeleteQuery = () =>
  useMutation({
    mutationFn: (userId: string) => userDeleteQueryFn(userId),
  })
