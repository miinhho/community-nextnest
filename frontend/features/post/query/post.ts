import { POST_QUERY } from '@/features/post/query/post-key'
import { fetcher } from '@/lib/fetch'
import { recursiveDateParse } from '@/lib/utils/parsing'
import { PageParams } from '@/types/page.types'
import { useMutation, useQuery } from '@tanstack/react-query'

// Post Get Paging Query
export const postListGetQueryFn = async ({ page = 0, size = 10 }: PageParams) => {
  const { data } = await fetcher.GET('/post', {
    params: {
      query: {
        page,
        size,
      },
    },
  })
  return {
    posts: recursiveDateParse(data?.posts),
    meta: data?.meta,
  }
}
export const usePostListGetQuery = (params: PageParams) =>
  useQuery({
    queryKey: [POST_QUERY.LIST, params],
    queryFn: () => postListGetQueryFn(params),
  })

// Post Get Query
export const postGetQueryFn = async (postId: string) => {
  const { data } = await fetcher.GET('/post/{id}', {
    params: { path: { id: postId } },
  })
  return recursiveDateParse(data)
}
export const usePostGetQuery = (postId: string) =>
  useQuery({
    queryKey: [POST_QUERY.POST, postId],
    queryFn: () => postGetQueryFn(postId),
  })

// Post Update Query
interface PostPutParam {
  postId: string
}
interface PostPutBody {
  content: string
}
export const postPutQueryFn = async ({ postId, content }: PostPutParam & PostPutBody) => {
  const { data } = await fetcher.PUT('/post/{id}', {
    params: { path: { id: postId } },
    body: { content },
  })
  return data
}
export const usePostPutQuery = () =>
  useMutation({
    mutationFn: (params: PostPutParam & PostPutBody) => postPutQueryFn(params),
  })

// Post Create Query
export const postCreateQueryFn = async (content: string) => {
  const { data } = await fetcher.POST('/post', {
    body: { content },
  })
  return data
}
export const usePostCreateQuery = () =>
  useMutation({
    mutationFn: (content: string) => postCreateQueryFn(content),
  })

// Post Delete Query
export const postDeleteQueryFn = async (postId: string) => {
  const { data } = await fetcher.DELETE('/post/{id}', {
    params: { path: { id: postId } },
  })
  return data
}
export const usePostDeleteQuery = () =>
  useMutation({
    mutationFn: (postId: string) => postDeleteQueryFn(postId),
  })
