import {
  NOTIFY_COMMENT_CONTENT_LEN,
  NOTIFY_POST_CONTENT_LEN,
} from '@/common/utils/content';
import { PageParams, toPageData } from '@/common/utils/page';
import { PrismaErrorHandler } from '@/prisma/prisma-error-handler.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotifyRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 알림 ID로 알림을 조회합니다.
   *
   * 알림 타입에 따라 필요한 필드만 선택적으로 반환합니다.
   * @param id - 알림 ID
   *
   * @throws {NotFoundException} - 알림을 찾을 수 없는 경우
   * @throws {InternalServerErrorException} - 알림 생성 중 오류 발생 시
   *
   * @type `POST_LIKE`: 게시글 좋아요 알림
   * @type `POST_COMMENT`: 게시글 댓글 알림
   * @type `COMMENT_LIKE`: 댓글 좋아요 알림
   * @type `COMMENT_REPLY`: 댓글 답글 알림
   * @type `FOLLOW`: 팔로우 알림
   * @type `SYSTEM`: 시스템 알림
   */
  @PrismaErrorHandler({
    RecordsNotFound: '알림을 찾을 수 없습니다.',
    Default: '알림 조회 중 오류 발생',
  })
  async findNotifyById(id: string) {
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
  }

  /**
   * 사용자 ID로 알림 목록을 조회합니다.
   *
   * 페이지네이션을 지원하며, 기본적으로 최신 알림부터 반환합니다.
   * @param userId - 사용자 ID
   * @param pageParams - 페이지 정보 (page, size)
   * @throws {InternalServerErrorException} - 알림 생성 중 오류 발생 시
   */
  @PrismaErrorHandler({
    Default: '알림 목록 조회 중 오류 발생',
  })
  async findNotifiesByUserId(userId: string, { page = 1, size = 10 }: PageParams) {
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
  }

  /**
   * 게시글 좋아요 알림을 생성합니다.
   * @param userId - 알림을 받을 사용자 ID
   * @param postId - 좋아요가 눌린 게시글 ID
   * @param viewerId - 좋아요를 누른 사용자 ID
   * @throws {NotFoundException} - 게시글 또는 사용자를 찾을 수 없는 경우
   * @throws {InternalServerErrorException} - 알림 생성 중 오류 발생 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '게시글 또는 사용자를 찾을 수 없습니다.',
    Default: '게시글 좋아요 알림 생성 중 오류 발생',
  })
  async createPostLikeNotify({
    userId,
    postId,
    viewerId,
  }: {
    userId: string;
    postId: string;
    viewerId: string;
  }) {
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

    const content = truncateContent(post.content, NotificationType.POST_LIKE);
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
  }

  /**
   * 게시글 댓글 알림을 생성합니다.
   * @param userId - 알림을 받을 사용자 ID
   * @param commentId - 댓글 ID
   * @throws {NotFoundException} - 게시글 또는 사용자를 찾을 수 없는 경우
   * @throws {InternalServerErrorException} - 알림 생성 중 오류 발생 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '게시글 또는 사용자를 찾을 수 없습니다.',
    Default: '게시글 알림 생성 중 오류 발생',
  })
  async createCommentNotify({
    userId,
    commentId,
  }: {
    userId: string;
    commentId: string;
  }) {
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

    const content = truncateContent(comment.content, NotificationType.POST_COMMENT);
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
  }

  /**
   * 댓글 좋아요 알림을 생성합니다.
   * @param userId - 알림을 받을 사용자 ID
   * @param commentId - 좋아요가 눌린 댓글 ID
   * @param viewerId - 좋아요를 누른 사용자 ID
   * @throws {NotFoundException} - 댓글 또는 사용자를 찾을 수 없는 경우
   * @throws {InternalServerErrorException} - 알림 생성 중 오류 발생 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '댓글 또는 사용자를 찾을 수 없습니다.',
    Default: '댓글 좋아요 알림 생성 중 오류 발생',
  })
  async createCommentLikeNotify({
    userId,
    commentId,
    viewerId,
  }: {
    userId: string;
    commentId: string;
    viewerId: string;
  }) {
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

    const content = truncateContent(comment.content, NotificationType.COMMENT_LIKE);
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
  }

  /**
   * 댓글 답글 알림을 생성합니다.
   * @param userId - 알림을 받을 사용자 ID
   * @param commentId - 댓글 ID
   * @param replyId - 답글 ID
   * @throws {NotFoundException} - 답글 또는 사용자를 찾을 수 없는 경우
   * @throws {InternalServerErrorException} - 알림 생성 중 오류 발생 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '답글이나 댓글을 찾을 수 없습니다.',
    Default: '댓글 답글 알림 생성 중 오류 발생',
  })
  async createReplyNotify({
    userId,
    commentId,
    replyId,
  }: {
    userId: string;
    commentId: string;
    replyId: string;
  }) {
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

    const content = truncateContent(reply.content, NotificationType.COMMENT_REPLY);
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
  }

  /**
   * 팔로우 알림을 생성합니다.
   * @param userId - 알림을 받을 사용자 ID
   * @param followerId - 팔로우한 사용자 ID
   * @throws {NotFoundException} - 사용자 또는 팔로워를 찾을 수 없는 경우
   * @throws {InternalServerErrorException} - 알림 생성 중 오류 발생 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '사용자 또는 팔로워를 찾을 수 없습니다.',
    Default: '팔로우 알람 생성 중 오류 발생',
  })
  async createFollowNotify({
    userId,
    followerId,
  }: {
    userId: string;
    followerId: string;
  }) {
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
  }

  /**
   * 시스템 알람을 생성합니다.
   * @param userId - 알림을 받을 사용자 ID
   * @param title - 알림 제목
   * @param content - 알림 내용
   * @throws {InternalServerErrorException} - 알림 생성 중 오류 발생 시
   */
  @PrismaErrorHandler({
    Default: '시스템 알람 생성 중 오류 발생',
  })
  async createSystemNotify({
    userId,
    title,
    content,
  }: {
    userId: string;
    title: string;
    content: string;
  }) {
    await this.prisma.notification.create({
      data: {
        type: NotificationType.SYSTEM,
        title,
        content,
        userId,
      },
      select: {},
    });
  }

  /**
   * 알람을 읽음 처리합니다.
   * @param id - 알람 ID
   * @throws {NotFoundException} - 알람을 찾을 수 없는 경우
   * @throws {InternalServerErrorException} - 알람 읽음 처리 중 오류 발생 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '알람을 찾을 수 없습니다.',
    Default: '알림 읽음 처리 중 오류 발생',
  })
  async markAsRead(id: string, userId: string) {
    await this.prisma.notification.update({
      where: { id, userId: userId },
      data: { isRead: true },
    });
  }

  /**
   * 사용자의 모든 알람을 읽음 처리합니다.
   * @param userId - 사용자 ID
   * @throws {InternalServerErrorException} - 알람 읽음 처리 중 오류 발생 시
   */
  @PrismaErrorHandler({
    Default: '모든 알림 읽음 처리 중 오류 발생',
  })
  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}

/**
 * 알림 내용이 너무 길 경우, 지정된 길이로 잘라서 반환합니다.
 * @param content - 알림 내용
 * @param type - 알림 타입
 */
function truncateContent(content: string, type: NotificationType) {
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
