import { NotifyPayload } from '@/notify/event/notify.event';
import { getNotifyEventKey } from '@/notify/event/notify.key';
import {
  getUserRoom,
  MARK_ALL_AS_READ_EVENT,
  MARK_AS_READ_EVENT,
} from '@/notify/socket/notify-socket.key';
import { NotifySocket, NotifySocketServer } from '@/notify/socket/notify-socket.types';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { NotificationType } from '@prisma/client';

const MAX_SOCKET_CONNECTIONS = 7;

@WebSocketGateway({
  cors: {
    origin: process.env.ORIGIN!,
  },
  namespace: '/notify',
})
export class NotifyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: NotifySocketServer;

  private readonly logger = new Logger(NotifyGateway.name);
  private userSockets = new Map<string, Set<string>>();

  constructor(
    private readonly eventHandler: EventEmitter2,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 소켓 연결 시 사용자 인증 처리 및 연결 관리
   * @param client 연결된 소켓 클라이언트
   */
  async handleConnection(client: NotifySocket) {
    try {
      const userId = await this.authenticateUser(client);
      // 사용자 인증 실패 시 연결 해제
      if (!userId) {
        client.disconnect();
        return;
      }

      const room = getUserRoom(userId);
      await client.join(room);
      client.data.userId = userId;

      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      const socketSets = this.userSockets.get(userId)!;
      // 최대 소켓 연결 수 초과 시 연결 거부
      if (socketSets.size >= MAX_SOCKET_CONNECTIONS) {
        this.logger.warn(
          `사용자 ${userId}의 소켓 연결이 최대치에 도달했습니다. 추가 연결을 거부합니다.`,
        );
        client.emit('error', { message: '최대 소켓 연결 수에 도달했습니다.' });
        client.disconnect();
        return;
      }
      socketSets.add(client.id);

      this.logger.log(`소켓 연결 성공: userId=${userId}, socketId=${client.id}`);

      client.emit('connected', {
        userId,
        message: '알림 소켓에 연결되었습니다.',
      });
    } catch (err) {
      this.logger.error('소켓 연결 실패', err);
      client.disconnect();
    }
  }

  /**
   * 소켓 연결 해제 시 사용자 소켓 관리
   * @param client 연결이 해제된 소켓 클라이언트
   */
  handleDisconnect(client: NotifySocket) {
    const userId = client.data.userId;
    if (!userId) return;

    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      userSockets.delete(client.id);
      if (userSockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }
    this.logger.log(`소켓 연결 해제: userId=${userId}, socketId=${client.id}`);
  }

  sendNotification(userId: string, type: NotificationType, payload: NotifyPayload) {
    const eventKey = getNotifyEventKey(type);
    this.eventHandler.emit(eventKey, userId, payload);
    this.logger.log(`${userId} 에게 알림 전송`, type, payload);
  }

  /**
   * 해당 알림을 읽음 상태로 변경합니다.
   *
   * 사용자 인증 실패 시 에러 메시지를 전송합니다.
   * @param client - 연결된 소켓 클라이언트
   * @param data - 알림 ID
   */
  @SubscribeMessage(MARK_AS_READ_EVENT)
  handleMarkAsRead(
    @ConnectedSocket() client: NotifySocket,
    @MessageBody() data: { notificationId: string },
  ) {
    try {
      const userId = client.data.userId;
      if (!userId) {
        client.emit('error', { message: '사용자 인증 실패' });
        return;
      }

      this.eventHandler.emit(
        getNotifyEventKey('MARK_AS_READ'),
        userId,
        data.notificationId,
      );

      this.server.to(`user:${userId}`).emit('notificationRead', {
        notificationId: data.notificationId,
      });
    } catch (err) {
      this.logger.error('알림 읽음 처리 실패', err);
      throw new WsException('알림 읽음 처리가 실패하였습니다.');
    }
  }

  /**
   * 해당 사용자의 모든 알림을 읽음 상태로 변경합니다.
   *
   * 사용자 인증 실패 시 에러 메시지를 전송합니다.
   * @param client - 연결된 소켓 클라이언트
   */
  @SubscribeMessage(MARK_ALL_AS_READ_EVENT)
  handleMarkAllAsRead(@ConnectedSocket() client: NotifySocket) {
    try {
      const userId = client.data.userId;
      if (!userId) {
        client.emit('error', { message: '사용자 인증 실패' });
        return;
      }

      this.eventHandler.emit(getNotifyEventKey('MARK_ALL_AS_READ'), userId);

      this.server.to(`user:${userId}`).emit('allNotificationsRead');
    } catch (err) {
      this.logger.error('모든 알림 읽음 처리 실패', err);
      throw new WsException('모든 알림 읽음 처리가 실패하였습니다.');
    }
  }

  /**
   * 소켓 클라이언트의 토큰을 검증하여 사용자 ID를 반환합니다.
   * @param client - 연결된 소켓 클라이언트
   */
  private async authenticateUser(client: NotifySocket) {
    const token =
      client.handshake.auth?.token ||
      client.handshake.headers?.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new WsException('토큰이 제공되지 않았습니다.');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      return payload.sub;
    } catch (err) {
      this.logger.error('토큰 인증 실패', err);
      throw new WsException('토큰 인증이 실패하였습니다.');
    }
  }
}
