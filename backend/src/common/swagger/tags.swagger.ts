import { ApiTags } from '@nestjs/swagger';

export const ApiUserTags = () => ApiTags('user');
export const ApiFollowTags = () => ApiTags('follow');
export const ApiPostTags = () => ApiTags('post');
export const ApiCommentTags = () => ApiTags('comment');
export const ApiAuthTags = () => ApiTags('auth');
export const ApiHealthCheckTags = () => ApiTags('health-check');
