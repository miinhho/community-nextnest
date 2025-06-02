import { ActionType } from "@/types/action";
import { PrismaError } from "prisma-error-enum";
import prisma from "../prisma";

/**
 * @param userId - 팔로잉을 하는 유저
 * @param targetId - `userId` 가 팔로잉을 할 유저
 *
 * 팔로우가 중복되면 언팔로우가 이루어진다
 */
export async function followUser(
  userId: string,
  targetId: string
): Promise<ActionType> {
  try {
    await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: targetId,
      },
    });
    return {
      success: true,
      message: "팔로우를 성공했습니다.",
    };
  } catch (err: any) {
    // 이미 팔로우 중일 때 팔로우 취소
    if (err.code === PrismaError.UniqueConstraintViolation) {
      const result = await unfollowUser(userId, targetId);
      return result;
    }
    return {
      success: false,
      error: "팔로우에 실패했습니다.",
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
): Promise<ActionType> {
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
      message: "언팔로우를 성공했습니다",
    };
  } catch (err) {
    return {
      success: false,
      error: "언팔로우에 실패했습니다.",
    };
  }
}
