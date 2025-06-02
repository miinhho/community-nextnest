/**
 * @param success - 성공했는지 실패했는지
 * @param error - error message
 */
export interface ActionType {
  success: boolean;
  message?: string;
  error?: string;
}
