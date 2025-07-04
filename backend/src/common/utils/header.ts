/**
 * 요청 헤더에서 클라이언트 정보를 추출하는 유틸리티 함수
 * @returns IP 주소와 User-Agent 정보
 */
export const getClientInfo = (headers?: any): ClientInfo => {
  return {
    ipAddress: (headers['x-forwarded-for'] ||
      headers['x-real-ip'] ||
      'unknown') as string,
    userAgent: (headers['user-agent'] || 'unknown') as string,
  };
};

/**
 * 클라이언트 정보 타입 정의
 * @property ipAddress - 클라이언트의 IP 주소
 * @property userAgent - 클라이언트의 User-Agent 정보
 */
export type ClientInfo = {
  ipAddress: string;
  userAgent: string;
};
