# Next.js + Nest.js + Community

트위터나 스레드와 같은 SNS 플랫폼에서 영감을 얻어 제작한 커뮤니티 플랫폼입니다.  


## FrontEnd

### Next.js  
- Caching & Fetching: Tanstack Query (React Query), Axios
- Store: Zustand
- Styling: Shadcn/ui, TailwindCSS
- Validation: Zod
- WYSIWYG editor: Lexical

### Provides

<br>

## BackEnd

### Nest.js  
- Database: PostgreSQL, Redis
- ORM: Prisma
- Auth: PassPort.js & JWT
- Validation: class-validator, class-transformer
- Security: Helmet
- Health Check: nestjs/terminus
- API Docs: Swagger
- WebSocket: socket.io & nestjs/websockets

### Provides
- Nginx 를 이용한 요청 제한, 보안, ssl 암호화, 통신 용량 최적화
- Prisma 에서의 인덱싱, 트랜잭션 최적화
- Redis 를 통해 핫한 게시글 캐싱, DB 트랜잭션 최소화
- Helmet 을 통한 보안 설정
- 모듈 의존성 최적화를 통한 Cold Start 시간 감소
- Repository / Service / Controller 패턴을 통한 모듈화
- EventEmitter2 를 사용한 모듈 결합도 약화
- Docker 와 배포 스크립트로 간략화된 배포 과정
- 대부분의 코드에 적용된 JSDoc 를 통한 개발자 경험 개선
- Swagger API 문서를 통한 문서화
- Nest.js Logger 를 통한 모니터링
- Health check 를 통한 모니터링

## Cross Platform App

### Expo
- TODO...


## Features

**Auth**:  
  - 로그인 / 로그아웃 / 회원가입 ✅
  - Google OAuth ❌

**유저**:  
  - 프로필 ✅
  - 팔로우 ✅
  - 알림 (친구 추가 요청, 메세지, 댓글) ✅
  - 비공개 / 공개 ✅
  - 차단 ✅
  - 다이렉트 메세지 ❌

**커뮤니티**:  
  - 글 작성 ✅
    - (이미지 첨부, 유튜브 동영상 첨부) ❌
  - 글 좋아요 ✅
  - 댓글 작성 ✅
  - 댓글 좋아요 ✅
  - 글 추천 ✅
    - hot score ✅
    - 개인화 ❌