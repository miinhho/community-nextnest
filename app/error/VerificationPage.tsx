import { CustomAuthError } from "@/lib/error/auth.error";

export default function VerificationPage() {
  return (
    <p>
      {"로그인 중 오류가 발생하였습니다."}
      {"로그인 재시도 후에 같은 오류가 발생한다면 관리자에게 문의해주세요. "}
      <code className="rounded-sm bg-slate-100 p-1 text-xs">
        {CustomAuthError.Verification}
      </code>
    </p>
  );
}