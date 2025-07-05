import { Server, Socket } from 'socket.io';

/**
 * @property {connected} - 소켓이 연결되었을 때 발생하는 이벤트
 * @property {error} - 소켓 연결 중 오류가 발생했을 때 발생하는 이벤트
 */
interface NotifySocketEventMap {
  connected: (data: { userId: string; message: string }) => void;
  error: (data: { message: string }) => void;
}

/**
 * @property {string} userId - 소켓이 연결된 사용자의 ID
 */
interface NotifySocketData {
  userId?: string;
}

/**
 * @extends {Socket} - Socket.io의 기본 Socket 타입
 */
export type NotifySocket = Socket<
  NotifySocketEventMap,
  NotifySocketEventMap,
  NotifySocketEventMap,
  NotifySocketData
>;

/**
 * @property {notificationRead} - 특정 알림이 읽혔을 때 발생하는 이벤트
 * @property {allNotificationsRead} - 모든 알림이 읽혔을 때 발생하는 이벤트
 */
interface NotifyServerEventMap {
  notificationRead: (data: { notificationId: string }) => void;
  allNotificationsRead: () => void;
}

/**
 * @extends {Server} - Socket.io의 기본 Server 타입
 */
export type NotifySocketServer = Server<
  NotifyServerEventMap,
  NotifyServerEventMap,
  NotifyServerEventMap
>;
