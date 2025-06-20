import { z } from 'zod/v4';

const alphabetNumbericRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

export const RegisterDto = z.object({
  email: z.email('유효한 이메일 주소가 아닙니다.'),
  password: z
    .string()
    .min(8, '8글자 이상의 비밀번호를 적어주세요')
    .max(25, '비밀번호는 25글자를 넘어갈 수 없습니다')
    .regex(alphabetNumbericRegex, '영문과 숫자가 모두 포함되어야 합니다')
    .regex(specialCharRegex, '특수문자가 포함되어야 합니다'),
  name: z.string().min(1, '이름을 입력해주세요').max(15, '이름은 15글자를 넘어갈 수 없습니다'),
});
export type RegisterDto = z.infer<typeof RegisterDto>;

export const LoginDto = z.object({
  email: z.email('유효한 이메일 주소가 아닙니다.'),
  password: z
    .string()
    .min(8, '8글자 이상의 비밀번호를 적어주세요')
    .max(25, '비밀번호는 25글자를 넘어갈 수 없습니다')
    .regex(alphabetNumbericRegex, '영문과 숫자가 모두 포함되어야 합니다')
    .regex(specialCharRegex, '특수문자가 포함되어야 합니다'),
});
export type LoginDto = z.infer<typeof LoginDto>;
