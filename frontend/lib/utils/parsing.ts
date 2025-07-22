/* eslint-disable @typescript-eslint/no-explicit-any */

const dateFields = ['createdAt', 'updatedAt', 'emailVerified']

/**
 * 문자열 값을 재귀적으로 Date 객체로 변환하는 함수입니다.
 */
export const recursiveDateParse = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj

  if (Array.isArray(obj)) {
    return obj.map(recursiveDateParse)
  }

  const result = { ...obj }

  for (const key in result) {
    if (dateFields.includes(key) && typeof result[key] === 'string') {
      result[key] = new Date(result[key])
    } else if (typeof result[key] === 'object') {
      result[key] = recursiveDateParse(result[key])
    }
  }

  return result
}
