import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const dateFields = ['createdAt', 'updatedAt', 'emailVerified'];
export const recursiveDateParse = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(recursiveDateParse);
  }

  const result = { ...obj };

  for (const key in result) {
    if (dateFields.includes(key) && typeof result[key] === 'string') {
      result[key] = new Date(result[key]);
    } else if (typeof result[key] === 'object') {
      result[key] = recursiveDateParse(result[key]);
    }
  }

  return result;
};
