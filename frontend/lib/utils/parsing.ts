/* eslint-disable @typescript-eslint/no-explicit-any */

const DATE_FIELDS = new Set(['createdAt', 'updatedAt', 'emailVerified'])

/**
 * 문자열 값을 재귀적으로 Date 객체로 변환하는 함수입니다.
 */
export const recursiveDateParse = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(recursiveDateParse)

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (DATE_FIELDS.has(key) && typeof value === 'string') {
        return [key, new Date(value)]
      }
      return [key, typeof value === 'object' ? recursiveDateParse(value) : value]
    }),
  )
}
