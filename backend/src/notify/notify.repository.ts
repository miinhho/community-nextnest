import {
  NOTIFY_COMMENT_CONTENT_LEN,
  NOTIFY_POST_CONTENT_LEN,
} from '@/common/utils/content';
import { PageParams, toPageData } from '@/common/utils/page';
import { PrismaDBError } from '@/prisma/error/prisma-db.error';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaError } from 'prisma-error-enum';

@Injectable()
export class NotifyRepository {
  private readonly logger = new Logger(NotifyRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findNotifyById(id: string) {
    try {
      const notify = await this.prisma.notification.findUniqueOrThrow({
        where: { id },
        select: {
          type: true,
          image: true,
          title: true,
          content: true,
          isRead: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          postId: true,
          commentId: true,
          follower: {
            select: {
              id: true,
              name: true,
            },
          },
          createdAt: true,
        },
      });

      const defaultNotifyData = {
        type: notify.type,
        image: notify.image,
        title: notify.title,
        content: notify.content,
        isRead: notify.isRead,
        user: notify.user,
        createdAt: notify.createdAt,
      };

      switch (notify.type) {
        case NotificationType.POST_LIKE:
        case NotificationType.POST_COMMENT:
          return {
            ...defaultNotifyData,
            postId: notify.postId,
          };
        case NotificationType.COMMENT_LIKE:
        case NotificationType.COMMENT_REPLY:
          return {
            ...defaultNotifyData,
            commentId: notify.commentId,
          };
        case NotificationType.FOLLOW:
          return {
            ...defaultNotifyData,
            follower: notify.follower,
          };
        case NotificationType.SYSTEM:
          return defaultNotifyData;
      }
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('알람을 찾을 수 없습니다.');
      }
      this.logger.error('알람 조회 중 오류 발생', err.stack, { id });
      throw new PrismaDBError('알람 조회 중 오류 발생', err.code);
    }
  }

  async findNotifiesByUserId(userId: string, { page = 1, size = 10 }: PageParams) {
    try {
      const [notifies, totalCount] = await this.prisma.$transaction([
        this.prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * size,
          take: size,
          select: {
            id: true,
            type: true,
            image: true,
            title: true,
            content: true,
            isRead: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            postId: true,
            commentId: true,
            follower: {
              select: {
                id: true,
                name: true,
              },
            },
            createdAt: true,
          },
        }),
        this.prisma.notification.count({
          where: { userId },
        }),
      ]);

      return toPageData<typeof notifies>({
        data: notifies,
        page,
        size,
        totalCount,
      });
    } catch (err) {
      this.logger.error('알람 목록 조회 중 오류 발생', err.stack, { userId, page, size });
      throw new PrismaDBError('알람 목록 조회 중 오류 발생', err.code);
    }
  }

  async createPostLikeNotify({
    userId,
    postId,
    viewerId,
  }: {
    userId: string;
    postId: string;
    viewerId: string;
  }) {
    try {
      const [post, like] = await this.prisma.$transaction([
        this.prisma.post.findUniqueOrThrow({
          where: { id: postId },
          select: {
            content: true,
          },
        }),
        this.prisma.postLikes.findUniqueOrThrow({
          where: {
            userId_postId: {
              userId: viewerId,
              postId,
            },
          },
          select: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        }),
      ]);

      const content = this.truncateContent(post.content, NotificationType.POST_LIKE);
      await this.prisma.notification.create({
        data: {
          type: NotificationType.POST_LIKE,
          image: like.user.image,
          title: `${like.user.name} 님이 좋아요를 눌렀습니다.`,
          content,
          postId,
          userId,
        },
        select: {},
      });
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('게시글 또는 사용자를 찾을 수 없습니다.');
      }
      this.logger.error('게시글 좋아요 알람 생성 중 오류 발생', err.stack, {
        userId,
        postId,
        viewerId,
      });
      throw new PrismaDBError('게시글 좋아요 알람 생성 중 오류 발생', err.code);
    }
  }

  async createCommentNotify({
    userId,
    commentId,
  }: {
    userId: string;
    commentId: string;
  }) {
    try {
      const comment = await this.prisma.comment.findUniqueOrThrow({
        where: { id: commentId },
        select: {
          content: true,
          author: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });

      const content = this.truncateContent(
        comment.content,
        NotificationType.POST_COMMENT,
      );
      await this.prisma.notification.create({
        data: {
          type: NotificationType.POST_COMMENT,
          image: comment.author.image,
          title: `${comment.author.name} 님이 댓글을 남겼습니다.`,
          content,
          commentId,
          userId,
        },
        select: {},
      });
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('게시글 또는 사용자를 찾을 수 없습니다.');
      }
      this.logger.error('게시글 댓글 알람 생성 중 오류 발생', err.stack, {
        userId,
        commentId,
      });
      throw new PrismaDBError('게시글 댓글 알람 생성 중 오류 발생', err.code);
    }
  }

  async createCommentLikeNotify({
    userId,
    commentId,
    viewerId,
  }: {
    userId: string;
    commentId: string;
    viewerId: string;
  }) {
    try {
      const [comment, like] = await this.prisma.$transaction([
        this.prisma.comment.findUniqueOrThrow({
          where: { id: commentId },
          select: {
            content: true,
          },
        }),
        this.prisma.commentLikes.findUniqueOrThrow({
          where: { userId_commentId: { userId: viewerId, commentId } },
          select: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        }),
      ]);

      const content = this.truncateContent(
        comment.content,
        NotificationType.COMMENT_LIKE,
      );
      await this.prisma.notification.create({
        data: {
          type: NotificationType.COMMENT_LIKE,
          title: `${like.user.name} 님이 댓글에 좋아요를 눌렀습니다.`,
          image: like.user.image,
          content,
          commentId,
          userId,
        },
        select: {},
      });
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('댓글 또는 사용자를 찾을 수 없습니다.');
      }
      this.logger.error('댓글 좋아요 알람 생성 중 오류 발생', err.stack, {
        userId,
        commentId,
      });
      throw new PrismaDBError('댓글 좋아요 알람 생성 중 오류 발생', err.code);
    }
  }

  async createReplyNotify({
    userId,
    commentId,
    replyId,
  }: {
    userId: string;
    commentId: string;
    replyId: string;
  }) {
    try {
      const reply = await this.prisma.comment.findUniqueOrThrow({
        where: { id: replyId, parentId: commentId },
        select: {
          content: true,
          author: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });

      const content = this.truncateContent(reply.content, NotificationType.COMMENT_REPLY);
      await this.prisma.notification.create({
        data: {
          type: NotificationType.COMMENT_REPLY,
          title: `${reply.author.name} 님이 댓글에 답글을 남겼습니다.`,
          image: reply.author.image,
          content,
          commentId,
          userId,
        },
        select: {},
      });
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('답글 또는 사용자를 찾을 수 없습니다.');
      }
      this.logger.error('댓글 답글 알람 생성 중 오류 발생', err.stack, {
        commentId,
        replyId,
      });
      throw new PrismaDBError('댓글 답글 알람 생성 중 오류 발생', err.code);
    }
  }

  async createFollowNotify({
    userId,
    followerId,
  }: {
    userId: string;
    followerId: string;
  }) {
    try {
      const follower = await this.prisma.user.findUniqueOrThrow({
        where: { id: followerId },
        select: {
          name: true,
          image: true,
        },
      });

      await this.prisma.notification.create({
        data: {
          type: NotificationType.FOLLOW,
          title: `새로운 팔로워`,
          content: `${follower.name} 님이 팔로우하였습니다.`,
          image: follower.image,
          userId,
          followerId,
        },
        select: {},
      });
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('사용자 또는 팔로워를 찾을 수 없습니다.');
      }
      this.logger.error('팔로우 알람 생성 중 오류 발생', err.stack, {
        userId,
        followerId,
      });
      throw new PrismaDBError('팔로우 알람 생성 중 오류 발생', err.code);
    }
  }

  async createSystemNotify({
    userId,
    title,
    content,
  }: {
    userId: string;
    title: string;
    content: string;
  }) {
    try {
      await this.prisma.notification.create({
        data: {
          type: NotificationType.SYSTEM,
          title,
          content,
          userId,
        },
        select: {},
      });
    } catch (err) {
      this.logger.error('시스템 알람 생성 중 오류 발생', err.stack, {
        userId,
        title,
        content,
      });
      throw new PrismaDBError('시스템 알람 생성 중 오류 발생', err.code);
    }
  }

  private truncateContent(content: string, type: NotificationType) {
    const getMaxLength = () => {
      switch (type) {
        case NotificationType.POST_LIKE:
          return NOTIFY_POST_CONTENT_LEN;
        case NotificationType.POST_COMMENT:
        case NotificationType.COMMENT_LIKE:
        case NotificationType.COMMENT_REPLY:
          return NOTIFY_COMMENT_CONTENT_LEN;
        default:
          return 20;
      }
    };

    const maxLength = getMaxLength();
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  }
}
