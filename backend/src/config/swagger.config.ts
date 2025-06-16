import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  title: 'Community API',
  description: 'API documentation for the Community application',
  version: '1.0',
}));
