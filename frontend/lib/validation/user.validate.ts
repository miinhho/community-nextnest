import { z } from 'zod/v4'

export const updateUserData = z.object({
  name: z
    .string()
    .min(1, { message: '이름을 입력해주세요' })
    .max(15, { message: '이름은 15글자를 넘어갈 수 없습니다' })
    .optional(),
  // TODO : Review after image upload feature is implemented
  image: z.url({ message: '유효한 이미지 URL이 아닙니다.' }).optional(),
})

export type UpdateUserData = z.infer<typeof updateUserData>
