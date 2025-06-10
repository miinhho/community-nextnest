import { Param, ParseUUIDPipe } from '@nestjs/common';

export const IdParam = (property: string = 'id'): ParameterDecorator => {
  return Param(property, new ParseUUIDPipe());
};
