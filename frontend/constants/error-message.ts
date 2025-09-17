/**
 * 각 오류 코드에 대한 제목, 설명, 아이콘을 포함합니다.
 */
type ErrorMessage = {
  title: string
  description: string
  icon: string
}

export type ErrorCode = '403' | '404' | '500' | 'unknown'

export const ERROR_MESSAGE: Record<ErrorCode, ErrorMessage> = {
  '403': {
    title: '접근이 거부되었습니다',
    description: '이 페이지에 접근할 권한이 없습니다. 관리자에게 문의하세요.',
    icon: '🔒',
  },
  '404': {
    title: '페이지를 찾을 수 없습니다',
    description: '요청하신 페이지가 존재하지 않거나 이동되었습니다.',
    icon: '🔍',
  },
  '500': {
    title: '서버 오류가 발생했습니다',
    description: '일시적인 서버 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
    icon: '⚠️',
  },
  unknown: {
    title: '알 수 없는 오류',
    description: '예상치 못한 오류가 발생했습니다. 다시 시도하거나 관리자에게 문의하세요.',
    icon: '❓',
  },
} as const
