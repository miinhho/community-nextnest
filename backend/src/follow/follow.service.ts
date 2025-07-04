import { BlockService } from '@/block/block.service';
import { FollowStatus } from '@/common/status';
import { PageParams } from '@/common/utils/page';
import { AlreadyFollowError } from '@/follow/error/already-follow.error';
import { FollowRepository } from '@/follow/follow.repository';
import { PrivateUserError } from '@/private/error/private-user.error';
import { PrivateService } from '@/private/private.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FollowRequestStatus } from '@prisma/client';

@Injectable()
export class FollowService {
  constructor(
    private readonly followRepository: FollowRepository,
    private readonly privateService: PrivateService,
    private readonly blockService: BlockService,
  ) {}

  /**
   * 사용자를 팔로우합니다. 이미 팔로우한 경우 토글 옵션에 따라 처리됩니다.
   * @param params.userId - 팔로우를 요청하는 사용자 ID
   * @param params.targetId - 팔로우할 대상 사용자 ID
   * @param params.toggle - 이미 팔로우한 경우 언팔로우 여부 (기본값: true)
   * @returns 팔로우 상태 (FOLLOW 또는 UNFOLLOW)
   * @throws {NotFoundException} 대상 사용자를 찾을 수 없는 경우
   * @throws {UserBlockedError} 내가 상대방을 차단한 경우 (`throwError`가 `true` 일 때)
   * @throws {BlockedError} 상대방이 나를 차단한 경우 (`throwError`가 `true` 일 때)
   * @throws {AlreadyFollowError} 이미 팔로우한 사용자인 경우 (toggle이 false일 때)
   * @throws {PrivateUserError} 비공개 사용자인 경우
   * @throws {PrismaDBError} 팔로우 실패 시
   */
  async followUser({
    userId,
    targetId,
    toggle = true,
  }: {
    userId: string;
    targetId: string;
    toggle?: boolean;
  }) {
    try {
      // 사용자 차단 여부 확인
      await this.blockService.isUserBlocked(
        {
          userId,
          targetId,
        },
        true,
      );

      // 사용자 비공개 여부 확인
      const isPrivate = await this.privateService.isUserPrivate(targetId);
      if (isPrivate) {
        throw new PrivateUserError();
      }

      await this.followRepository.followUser({
        userId,
        targetId,
      });
      return FollowStatus.FOLLOW;
    } catch (err) {
      if (toggle && err instanceof AlreadyFollowError) {
        return this.unfollowUser({
          userId,
          targetId,
        });
      }
      throw err;
    }
  }

  /**
   * 팔로우 요청을 수락합니다.
   * @param props - 팔로우 요청 수락 파라미터
   * @param props.userId - 팔로우 요청을 수락하는 사용자 ID
   * @param props.targetId - 팔로우 요청을 보낸 대상 사용자 ID
   * @returns 팔로우 요청 상태 (ACCEPTED)
   * @throws {NotFoundException} 대상 사용자를 찾을 수 없는 경우
   * @throws {NotFoundException} 팔로우 요청이 존재하지 않는 경우
   * @throws {PrismaDBError} 팔로우 요청 수락 실패 시
   */
  async acceptFollowRequest(props: { userId: string; targetId: string }) {
    const isValidRequest = await this.followRepository.isFollowRequested({
      userId: props.targetId,
      targetId: props.userId,
    });
    if (!isValidRequest) {
      throw new NotFoundException('팔로우 요청이 존재하지 않습니다.');
    }
    await this.followRepository.followUser(props);
    return FollowRequestStatus.ACCEPTED;
  }

  /**
   * 팔로우 요청을 보냅니다.
   * @param props - 팔로우 요청 파라미터
   * @param props.userId - 팔로우 요청을 보내는 사용자 ID
   * @param props.targetId - 팔로우 요청을 받을 대상 사용자 ID
   * @returns 팔로우 상태 (REJECTED 또는 ACCEPTED)
   * @throws {NotFoundException} 대상 사용자를 찾을 수 없는 경우
   * @throws {PrismaDBError} 팔로우 요청 실패 시
   */
  async sendFollowRequest(props: { userId: string; targetId: string }) {
    await this.followRepository.createFollowRequest(props);
  }

  /**
   * 팔로우 요청을 거절합니다.
   * @param props - 팔로우 요청 거절 파라미터
   * @param props.userId - 팔로우 요청을 거절하는 사용자 ID
   * @param props.targetId - 팔로우 요청을 보낸 대상 사용자 ID
   * @returns 팔로우 상태 (REJECTED)
   * @throws {NotFoundException} 대상 사용자를 찾을 수 없는 경우
   * @throws {PrismaDBError} 팔로우 요청 거절 실패 시
   */
  async rejectFollowRequest(props: { userId: string; targetId: string }) {
    await this.followRepository.deleteFollowRequest(props);
    return FollowRequestStatus.REJECTED;
  }

  /**
   * 사용자 팔로우를 취소합니다.
   * @param props - 언팔로우 파라미터
   * @param props.userId - 언팔로우를 요청하는 사용자 ID
   * @param props.targetId - 언팔로우할 대상 사용자 ID
   * @returns 팔로우 상태 (UNFOLLOW)
   * @throws {PrismaDBError} 존재하지 않는 사용자이거나 언팔로우 실패 시
   */
  async unfollowUser(props: { userId: string; targetId: string }) {
    await this.followRepository.unfollowUser(props);
    return FollowStatus.UNFOLLOW;
  }

  /**
   * 두 사용자 간의 팔로우 관계를 확인합니다.
   * @param params.userId - 팔로우를 요청한 사용자 ID
   * @param params.targetId - 팔로우 대상 사용자 ID
   * @returns 팔로우 여부 (true: 팔로우 중, false: 팔로우하지 않음)
   * @throws {PrismaDBError} 팔로우 상태 확인 실패 시
   */
  async isFollowing({ userId, targetId }: { userId: string; targetId: string }) {
    return this.followRepository.isFollowing({
      userId,
      targetId,
    });
  }

  /**
   * 특정 사용자의 팔로워 수를 조회합니다.
   * @param userId - 팔로워 수를 조회할 사용자 ID
   * @returns 팔로워 수
   * @throws {PrismaDBError} 팔로워 수 조회 실패 시
   */
  async getFollowersCount(userId: string) {
    return this.followRepository.getFollowersCount(userId);
  }

  /**
   * 특정 사용자가 팔로우하는 사용자 수를 조회합니다.
   * @param userId - 팔로잉 수를 조회할 사용자 ID
   * @returns 팔로잉 수
   * @throws {PrismaDBError} 팔로잉 수 조회 실패 시
   */
  async getFollowingCount(userId: string) {
    return this.followRepository.getFollowingCount(userId);
  }

  /**
   * 특정 사용자의 팔로워 목록을 페이지네이션으로 조회합니다.
   * @param userId - 팔로워 목록을 조회할 사용자 ID
   * @param pageParams - 페이지네이션 파라미터
   * @returns 페이지네이션된 팔로워 목록
   * @throws {PrismaDBError} 팔로워 목록 조회 실패 시
   */
  async getFollowers(userId: string, pageParams: PageParams) {
    return this.followRepository.getFollowers(userId, pageParams);
  }

  /**
   * 특정 사용자가 팔로우하는 사용자 목록을 페이지네이션으로 조회합니다.
   * @param userId - 팔로잉 목록을 조회할 사용자 ID
   * @param pageParams - 페이지네이션 파라미터
   * @returns 페이지네이션된 팔로잉 목록
   * @throws {PrismaDBError} 팔로잉 목록 조회 실패 시
   */
  async getFollowing(userId: string, pageParams: PageParams) {
    return this.followRepository.getFollowing(userId, pageParams);
  }
}
