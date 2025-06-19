import { BaseTimestamp, TimeStampKey } from '@/lib/types/schema.types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseDates = <T extends BaseTimestamp>(obj: T) => {
  return {
    ...obj,
    [TimeStampKey.CreatedAt]: new Date(obj[TimeStampKey.CreatedAt]),
    [TimeStampKey.UpdatedAt]: new Date(obj[TimeStampKey.UpdatedAt]),
  };
};

export const parseDatesArray = <T extends BaseTimestamp>(arr: T[]) => {
  return arr.map((item) => parseDates(item));
};
