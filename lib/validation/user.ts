import { z } from "zod/v4";

export const CreateUserDto = z.object({
  email: z.email("유효한 이메일 주소가 아닙니다."),
  name: z
    .string()
    .min(2, "2글자 이상의 이름을 지어주세요.")
    .max(20, "이름은 20글자를 넘어갈 수 없습니다."),
  password: z
    .string()
    .min(8, "8글자 이상의 비밀번호를 적어주세요.")
    .max(25, "비밀번호는 25글자를 넘어갈 수 없습니다."),
});
