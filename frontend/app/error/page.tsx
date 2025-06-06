import { CustomAuthError } from "@/lib/error/auth.error";
import { NextSearchParam, SearchParamHelper } from "@/lib/helper/param.helper";
import AccessDeniedPage from "./AccessDeniedPage";
import ConfigErrorPage from "./ConfigErrorPage";
import DefaultErrorPage from "./DefaultErrorPage";
import VerificationPage from "./VerificationPage";

interface Props {
  searchParams: NextSearchParam;
}

const errorPageMap = {
  [CustomAuthError.Configuration]: <ConfigErrorPage />,
  [CustomAuthError.AccessDenied]: <AccessDeniedPage />,
  [CustomAuthError.Verification]: <VerificationPage />,
  [CustomAuthError.Default]: <DefaultErrorPage />,
};

export default async function ErrorPage({ searchParams }: Props) {
  const error = await SearchParamHelper.getString(searchParams, "status");

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <a
        href="#"
        className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 text-center shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <h5 className="mb-2 flex flex-row items-center justify-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          오류가 발생하였습니다
        </h5>
        <div className="font-normal text-gray-700 dark:text-gray-400">
          {errorPageMap[error as CustomAuthError] || "알 수 없는 오류 - 관리자에게 연락해주시길 바랍니다"}
        </div>
      </a>
    </div>
  )
}