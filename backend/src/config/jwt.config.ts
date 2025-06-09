import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET!,
  accessExpiration: parseInt(process.env.JWT_ACCESS_EXPIRATION!, 10),
  refreshSecret: process.env.JWT_REFRESH_SECRET!,
  refreshExpiration: parseInt(process.env.JWT_REFRESH_EXPIRATION!, 10),
}));
