import { mapValues } from 'es-toolkit'
import { isObject } from 'es-toolkit/compat'

const DATE_FIELDS = ['createdAt', 'updatedAt', 'emailVerified'] as const
type DateField = (typeof DATE_FIELDS)[number]

type Parsed<T> = T extends (infer U)[]
  ? Parsed<U>[]
  : T extends object
    ? { [K in keyof T]: K extends DateField ? Date : Parsed<T[K]> }
    : T

export const recursiveDateParse = <T>(obj: T): Parsed<T> => {
  if (!obj || typeof obj !== 'object') return obj as Parsed<T>

  if (Array.isArray(obj)) {
    return obj.map(recursiveDateParse) as Parsed<T>
  }

  return mapValues(obj, (value, key) => {
    if (DATE_FIELDS.includes(key as DateField) && typeof value === 'string') {
      return new Date(value)
    } else if (isObject(value) && value !== null) {
      return recursiveDateParse(value)
    }
    return value
  }) as Parsed<T>
}
