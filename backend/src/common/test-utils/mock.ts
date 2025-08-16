import { EventEmitterModule } from '@nestjs/event-emitter';
import { MockFactory } from '@nestjs/testing';
import { MockMetadata, ModuleMocker } from 'jest-mock';

export const eventEmitterMock: MockFactory = (token) => {
  if (token === EventEmitterModule) {
    return {
      emit: jest.fn(),
    };
  }
};

const moduleMocker = new ModuleMocker(global);

export const allMock: MockFactory = (token) => {
  if (typeof token === 'function') {
    const mockMetadata = moduleMocker.getMetadata(token) as MockMetadata<any, any>;
    const Mock = moduleMocker.generateFromMetadata(mockMetadata) as ObjectConstructor;
    return new Mock();
  }
};
