import { NotifyEventListener } from '@/notify/event/notify.listener';
import { NotifyPublisher } from '@/notify/event/notify.publisher';
import { NotifyRepository } from '@/notify/notify.repository';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';

describe('NotifyEvent', () => {
  let publisher: NotifyPublisher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [NotifyPublisher, NotifyEventListener, NotifyRepository],
    }).compile();

    publisher = module.get<NotifyPublisher>(NotifyPublisher);
  });

  it('should be defined', () => {
    expect(publisher).toBeDefined();
  });
});
