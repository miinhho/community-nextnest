/**
 * 작업의 결과를 나타내는 타입
 *
 * @param success - 성공 여부
 * @param status - 결과 상태
 * @param message - 세부 메세지
 * @template T - 결과 상태의 타입 (기본값: string)
 */
export interface ActionType<D = any, T = string> {
  success: boolean;
  data?: Partial<D>;
  status?: T;
  message?: string;
}

/**
 * 비동기 작업의 결과를 나타내는 Promise 타입
 *
 * @template T - 결과 상태의 타입 (기본값: string)
 */
export type AsyncActionType<D = any, T = string> = Promise<ActionType<D, T>>;
