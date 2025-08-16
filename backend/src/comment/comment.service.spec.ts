import { CommentRepository } from '@/comment/comment.repository';
import { CommentService } from '@/comment/comment.service';
import { UserData } from '@/common/user';
import { NotifyPublisher } from '@/notify/event/notify.publisher';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';

const mockCommentRepository = {
  isExistingCommentView: jest.fn(),
  addCommentView: jest.fn(),
  findCommentById: jest.fn(),
  createComment: jest.fn(),
  createCommentReply: jest.fn(),
};

describe('CommentController', () => {
  let service: CommentService;
  let repository: CommentRepository;
  let notifyPublisher: NotifyPublisher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentService, CommentRepository, NotifyPublisher],
    })
      .overrideProvider(CommentRepository)
      .useValue(mockCommentRepository)
      .compile();

    service = module.get<CommentService>(CommentService);
    repository = module.get<CommentRepository>(CommentRepository);
    notifyPublisher = module.get<NotifyPublisher>(NotifyPublisher);
  });

  it('모듈이 제대로 생성되어 서비스가 정의되어야 합니다', () => {
    expect(service).toBeDefined();
  });

  it('createComment: 댓글의 Id 가 반환되고 게시글 작성자에게 댓글 알림이 발행되어야 합니다', async () => {
    const props = {
      postId: 'post-id',
      authorId: 'author-id',
      content: '댓글 내용',
    };
    const commentId = 'new-comment-id';
    jest.spyOn(repository, 'createComment').mockResolvedValue({ id: commentId });
    const notifySpy = jest.spyOn(notifyPublisher, 'commentNofify');

    // 댓글 Id 반환 확인
    await expect(service.createComment(props)).resolves.toBe(commentId);
    // 게시글 작성자에게 댓글 알림 발행 확인
    expect(notifySpy).toHaveBeenCalledWith(props.authorId, { commentId });
  });

  it('createCommentReply: 답글의 Id 가 반환되고 부모 댓글 작성자에게 답글 알림이 발행되어야 합니다', async () => {
    const props = {
      authorId: 'author-id',
      postId: 'post-id',
      commentId: 'parent-comment-id',
      content: '답글 내용',
    };
    const replyId = 'new-reply-id';
    jest.spyOn(repository, 'createCommentReply').mockResolvedValue({ id: replyId });
    const notifySpy = jest.spyOn(notifyPublisher, 'commentReplyNotify');

    // 답글 Id 반환 확인
    await expect(service.createCommentReply(props)).resolves.toBe(replyId);
    // 부모 댓글 작성자에게 답글 알림 발행 확인
    expect(notifySpy).toHaveBeenCalledWith(props.authorId, {
      replyId,
      commentId: props.commentId,
    });
  });

  it('findCommentById: 이미 조회한 경우 조회수가 증가하지 않아야 합니다', async () => {
    const commentId = 'comment-id';
    const user: UserData = { id: 'user-id', role: Role.USER };

    jest.spyOn(repository, 'isExistingCommentView').mockResolvedValue(true);
    const viewSpy = jest.spyOn(repository, 'addCommentView');

    await service.findCommentById(commentId, user);
    // 조회수 증가가 호출되지 않았는지 확인
    expect(viewSpy).not.toHaveBeenCalled();
  });

  it('findCommentById: 조회하지 않은 경우 조회수가 증가해야 합니다', async () => {
    const commentId = 'comment-id';
    const user: UserData = { id: 'user-id', role: Role.USER };

    jest.spyOn(repository, 'isExistingCommentView').mockResolvedValue(false);
    const viewSpy = jest.spyOn(repository, 'addCommentView');

    await service.findCommentById(commentId, user);
    // 조회수 증가가 호출되었는지 확인
    expect(viewSpy).toHaveBeenCalled();
  });
});
