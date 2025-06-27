import { UserData } from '@/common/user';
import { PageParams } from '@/common/utils/page';
import { NotifyRepository } from '@/notify/notify.repository';
import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class NofifyService {
  constructor(private readonly notifyRepository: NotifyRepository) {}

  async findNotifyById(id: string, user: UserData) {
    const notify = await this.notifyRepository.findNotifyById(id);
    if (notify?.user.id !== user.id) {
      throw new ForbiddenException('해당 알림을 조회할 권한이 없습니다.');
    }
    return notify;
  }

  async findNotifiesByUserId(userId: string, pageParams: PageParams, user: UserData) {
    if (userId !== user.id) {
      throw new ForbiddenException('다른 사용자의 알림을 조회할 수 없습니다.');
    }
    return this.notifyRepository.findNotifiesByUserId(userId, pageParams);
  }

  async createPostLikeNotify(props: {
    userId: string;
    postId: string;
    viewerId: string;
  }) {
    return this.notifyRepository.createPostLikeNotify(props);
  }

  async createCommentNotify(props: { userId: string; commentId: string }) {
    return this.notifyRepository.createCommentNotify(props);
  }

  async createCommentLikeNotify(props: {
    userId: string;
    commentId: string;
    viewerId: string;
  }) {
    return this.notifyRepository.createCommentLikeNotify(props);
  }

  async createReplyNotify(props: { userId: string; commentId: string; replyId: string }) {
    return this.notifyRepository.createReplyNotify(props);
  }

  async createFollowNotify(props: { userId: string; followerId: string }) {
    return this.notifyRepository.createFollowNotify(props);
  }

  async createSystemNotify(props: { userId: string; title: string; content: string }) {
    return this.notifyRepository.createSystemNotify(props);
  }
}
