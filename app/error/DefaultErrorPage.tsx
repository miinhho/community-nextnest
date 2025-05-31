import { CustomAuthError } from "@/lib/error/auth.error";

export default function DefaultErrorPage() {
  return (
    <p>
      {"오류가 발생하였습니다."}
      {"관리자에게 아래의 오류 코드와 함께 문의해주신다면 감사드리겠습니다. "}
      <code className="rounded-sm bg-slate-100 p-1 text-xs">
        {CustomAuthError.Default}
      </code>
    </p>
  );
}