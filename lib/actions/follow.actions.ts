import { AsyncActionType } from "@/types/action";
import { FollowStatus } from "@/types/action.status";
import { PrismaError } from "prisma-error-enum";
import prisma from "../prisma";

/**
 * 팔로우가 중복되면 언팔로우가 이루어진다
 *
 * @param userId - 팔로잉을 하는 유저
 * @param targetId - `userId` 가 팔로잉을 할 유저
 */
export async function followUser(
  userId: string,
  targetId: string
): AsyncActionType<FollowStatus> {
  try {
    await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: targetId,
      },
    });
    return {
      success: true,
      status: FollowStatus.FOLLOW_SUCCESS,
    };
  } catch (err: any) {
    // 이미 팔로우 중일 때 팔로우 취소
    if (err.code === PrismaError.UniqueConstraintViolation) {
      return {
        success: false,
        status: FollowStatus.FOLLOW_DUPLICATED,
      };
    }
    return {
      success: false,
      status: FollowStatus.FOLLOW_FAILED,
    };
  }
}

/**
 * @param userId - 언팔로잉을 할 유저
 * @param targetId - `userId` 가 언팔로잉을 하는 유저
 */
export async function unfollowUser(
  userId: string,
  targetId: string
): AsyncActionType<FollowStatus> {
  try {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetId,
        },
      },
    });
    return {
      success: true,
      status: FollowStatus.UNFOLLOW_SUCCESS,
    };
  } catch (err) {
    return {
      success: false,
      status: FollowStatus.UNFOLLOW_FAILED,
    };
  }
}
