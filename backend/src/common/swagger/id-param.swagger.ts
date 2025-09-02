import { ApiParam } from '@nestjs/swagger';

export const ApiIdParam = ({ description }: { description: string }) =>
  ApiParam({
    name: 'id',
    description,
    type: 'string',
    format: 'uuid',
  });
