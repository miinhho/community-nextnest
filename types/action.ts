/**
 * 작업의 결과를 나타내는 타입
 *
 * @param success - 성공 여부
 * @param status - 결과 상태
 * @param message - 세부 메세지
 * @template T - 결과 상태의 타입 (기본값: string)
 */
export interface ActionType<T = string> {
  success: boolean;
  status?: T;
  message?: string;
}

/**
 * 비동기 작업의 결과를 나타내는 Promise 타입
 *
 * @template T - 결과 상태의 타입 (기본값: string)
 */
export type AsyncActionType<T = string> = Promise<ActionType<T>>;
