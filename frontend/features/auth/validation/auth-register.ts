import { ALPHABET_NUMBERIC_REGEX, SPECIAL_CHAR_REGEX } from '@/constants/regex'
import z from 'zod'

export const registerData = z.object({
  email: z.email('유효한 이메일 주소가 아닙니다.').nonempty('이메일을 입력해주세요'),
  password: z
    .string()
    .min(8, '8글자 이상의 비밀번호를 적어주세요')
    .max(25, '비밀번호는 25글자를 넘어갈 수 없습니다')
    .regex(ALPHABET_NUMBERIC_REGEX, '영문과 숫자가 모두 포함되어야 합니다')
    .regex(SPECIAL_CHAR_REGEX, '특수문자가 포함되어야 합니다')
    .nonempty('비밀번호를 입력해주세요'),
  name: z
    .string()
    .min(1, '이름을 입력해주세요')
    .max(15, '이름은 15글자를 넘어갈 수 없습니다')
    .nonempty('이름을 입력해주세요'),
})
export type RegisterData = z.infer<typeof registerData>
