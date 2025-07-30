import { userSelections } from '@/common/select';
import { PageParams, toPageData } from '@/common/utils/page';
import { AlreadyFollowRequestError } from '@/follow/error/already-follow-request.error';
import { AlreadyFollowError } from '@/follow/error/already-follow.error';
import { PrismaErrorHandler } from '@/prisma/prisma-error-handler.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaError } from 'prisma-error-enum';

@Injectable()
export class FollowRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 사용자를 팔로우합니다.
   * @param params.userId - 팔로우를 요청하는 사용자 ID
   * @param params.targetId - 팔로우할 대상 사용자 ID
   * @throws {AlreadyFollowError} 이미 팔로우한 사용자인 경우
   * @throws {InternalServerErrorException} 팔로우 실패 시
   */
  @PrismaErrorHandler({
    Default: '팔로우 중 오류 발생',
  })
  async followUser({ userId, targetId }: { userId: string; targetId: string }) {
    try {
      await this.prisma.follow.create({
        data: {
          followerId: userId,
          followingId: targetId,
        },
      });
    } catch (err) {
      if (err.code === PrismaError.UniqueConstraintViolation) {
        throw new AlreadyFollowError(userId, targetId);
      }
      throw err;
    }
  }

  /**
   * 사용자 팔로우를 취소합니다.
   * @param params.userId - 언팔로우를 요청하는 사용자 ID
   * @param params.targetId - 언팔로우할 대상 사용자 ID
   * @throws {InternalServerErrorException} 존재하지 않는 사용자이거나 언팔로우 실패 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '존재하지 않는 사용자입니다.',
    Default: '언팔로우 중 오류 발생',
  })
  async unfollowUser({ userId, targetId }: { userId: string; targetId: string }) {
    await this.prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetId,
        },
      },
      select: {},
    });
  }

  /**
   * 사용자와 팔로우 요청을 받았는지 확인합니다.
   * @param params.userId - 팔로우 요청을 보냈는지 확인할 사용자 ID
   * @param params.targetId - 팔로우 요청을 받았는지 확인할 사용자 ID
   */
  @PrismaErrorHandler({
    Default: '팔로우 요청 상태 확인 중 오류 발생',
  })
  async isFollowRequested({ userId, targetId }: { userId: string; targetId: string }) {
    const followRequest = await this.prisma.followRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId: userId,
          receiverId: targetId,
        },
      },
      select: {},
    });
    return !!followRequest;
  }

  /**
   * 사용자가 팔로우 요청을 보낸 사용자들의 목록을 조회합니다.
   * @param userId - 팔로우 요청을 보낸 사용자 ID
   * @throws {InternalServerErrorException} 팔로우 요청 조회 실패 시
   */
  @PrismaErrorHandler({
    Default: '팔로우 요청 조회 중 오류 발생',
  })
  findFollowRequestSent(userId: string) {
    return this.prisma.followRequest.findMany({
      where: { senderId: userId },
      select: {
        sender: {
          select: userSelections,
        },
      },
    });
  }

  /**
   * 사용자가 팔로우 요청을 받은 사용자들의 목록을 조회합니다.
   * @param userId - 팔로우 요청을 받은 사용자 ID
   * @throws {InternalServerErrorException} 팔로우 요청 조회 실패 시
   */
  @PrismaErrorHandler({
    Default: '팔로우 요청 조회 중 오류 발생',
  })
  findFollowRequestReceived(userId: string) {
    return this.prisma.followRequest.findMany({
      where: { receiverId: userId },
      select: {
        receiver: {
          select: userSelections,
        },
      },
    });
  }

  /**
   * 팔로우 요청을 생성합니다.
   * @param params.userId - 팔로우 요청을 보낸 사용자 ID
   * @param params.targetId - 팔로우 요청을 받은 대상 사용자 ID
   * @throws {AlreadyFollowRequestError} 이미 팔로우 요청이 존재하는 경우
   * @throws {InternalServerErrorException} 팔로우 요청 실패 시
   */
  @PrismaErrorHandler({
    Default: '팔로우 요청 중 오류 발생',
  })
  async createFollowRequest({ userId, targetId }: { userId: string; targetId: string }) {
    try {
      await this.prisma.followRequest.create({
        data: {
          senderId: userId,
          receiverId: targetId,
        },
      });
    } catch (err) {
      if (err.code === PrismaError.UniqueConstraintViolation) {
        throw new AlreadyFollowRequestError(userId, targetId);
      }
      throw err;
    }
  }

  /**
   * 팔로우 요청을 삭제합니다.
   * @param params.userId - 팔로우 요청을 보낸 사용자 ID
   * @param params.targetId - 팔로우 요청을 받은 대상 사용자 ID
   * @throws {NotFoundException} - 팔로우 요청이 존재하지 않을 시
   * @throws {InternalServerErrorException} - 팔로우 요청 취소 실패 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '존재하지 않는 팔로우 요청입니다.',
    Default: '팔로우 요청 취소 중 오류 발생',
  })
  async deleteFollowRequest({ userId, targetId }: { userId: string; targetId: string }) {
    await this.prisma.followRequest.delete({
      where: {
        senderId_receiverId: {
          senderId: userId,
          receiverId: targetId,
        },
      },
    });
  }

  /**
   * 두 사용자 간의 팔로우 관계를 확인합니다.
   * @param params.userId - 팔로우를 요청한 사용자 ID
   * @param params.targetId - 팔로우 대상 사용자 ID
   * @returns 팔로우 여부 (true: 팔로우 중, false: 팔로우하지 않음)
   * @throws {InternalServerErrorException} 팔로우 상태 확인 실패 시
   */
  @PrismaErrorHandler({
    Default: '팔로우 상태 확인 중 오류 발생',
  })
  async isFollowing({ userId, targetId }: { userId: string; targetId: string }) {
    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetId,
        },
      },
      select: {},
    });
    return !!follow;
  }

  /**
   * 특정 사용자의 팔로워 수를 조회합니다.
   * @param userId - 팔로워 수를 조회할 사용자 ID
   * @throws {InternalServerErrorException} 팔로워 수 조회 실패 시
   */
  @PrismaErrorHandler({
    Default: '팔로워 수 조회 중 오류 발생',
  })
  async getFollowersCount(userId: string) {
    return this.prisma.follow.count({
      where: { followingId: userId },
    });
  }

  /**
   * 특정 사용자가 팔로우하는 사용자 수를 조회합니다.
   * @param userId - 팔로잉 수를 조회할 사용자 ID
   * @throws {InternalServerErrorException} 팔로잉 수 조회 실패 시
   */
  @PrismaErrorHandler({
    Default: '팔로잉 수 조회 중 오류 발생',
  })
  async getFollowingCount(userId: string) {
    return this.prisma.follow.count({
      where: { followerId: userId },
    });
  }

  /**
   * 특정 사용자의 팔로워 목록을 페이지네이션으로 조회합니다.
   * @param userId - 팔로워 목록을 조회할 사용자 ID
   * @param params.page - 페이지 번호 (기본값: 1)
   * @param params.size - 페이지 크기 (기본값: 10)
   * @throws {InternalServerErrorException} 팔로워 목록 조회 실패 시
   */
  @PrismaErrorHandler({
    Default: '팔로워 목록 조회 중 오류 발생',
  })
  async getFollowers(userId: string, { page = 1, size = 10 }: PageParams) {
    const [followers, totalCount] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followingId: userId },
        select: {
          follower: {
            select: userSelections,
          },
        },
        skip: (page - 1) * size,
        take: size,
      }),
      this.prisma.follow.count({ where: { followingId: userId } }),
    ]);

    return toPageData<typeof followers>({
      data: followers,
      totalCount,
      page,
      size,
    });
  }

  /**
   * 특정 사용자가 팔로우하는 사용자 목록을 페이지네이션으로 조회합니다.
   * @param userId - 팔로잉 목록을 조회할 사용자 ID
   * @param params.page - 페이지 번호 (기본값: 1)
   * @param params.size - 페이지 크기 (기본값: 10)
   * @throws {InternalServerErrorException} 팔로잉 목록 조회 실패 시
   */
  @PrismaErrorHandler({
    Default: '팔로잉 목록 조회 중 오류 발생',
  })
  async getFollowing(userId: string, { page = 1, size = 10 }: PageParams) {
    const [following, totalCount] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followerId: userId },
        select: {
          following: {
            select: userSelections,
          },
        },
        skip: (page - 1) * size,
        take: size,
      }),
      this.prisma.follow.count({ where: { followerId: userId } }),
    ]);

    return toPageData<typeof following>({
      data: following,
      totalCount,
      page,
      size,
    });
  }
}
