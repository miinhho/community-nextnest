# Next.js + Nest.js + Community

트위터나 스레드와 같은 SNS 플랫폼에서 영감을 얻어 제작한 커뮤니티 플랫폼입니다.  



## FrontEnd

### Next.js  
- Caching & Fetching: Tanstack Query (React Query), Axios
- Store: Zustand
- Styling: Shadcn/ui, TailwindCSS
- Validation: Zod
- WYSIWYG editor: Lexical


## BackEnd

### Nest.js  
- Database: PostgreSQL
- ORM: Prisma
- Auth: PassPort.js & JWT
- Validation: class-validator, class-transformer
- Security: Helmet
- Health Check: nestjs/terminus
- API Docs: Swagger

<br>

## Features

**Auth**:  
  - 로그인 / 로그아웃 / 회원가입
  - Google OAuth

**유저**:  
  - 프로필
  - 팔로우
  - 다이렉트 메세지
  - 알림 (친구 추가 요청, 메세지, 댓글)
  - 비공개 / 공개
  - 차단

**커뮤니티**:  
  - 글 작성 (이미지 첨부, 유튜브 동영상 첨부)
  - 글 좋아요
  - 댓글 작성
  - 댓글 좋아요

**개발**:
  - Prisma 에서의 인덱싱, 트랜잭션 최적화
  - 보안 설정(Helmet)
  - 네트워크 속도 최적화(Compression)
  - 모듈 의존성 최적화
  - Repository / Service / Controller 패턴을 통한 모듈화
  - JSDoc
  - Swagger API 문서
  - Nest.js Logger
  - Health check

<br>