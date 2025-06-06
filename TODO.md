1. 먼저 게시판 기능 구현 X, 메인 페이지에 모두 몰아서 글 CRUD 기능 구현 ✅
- Prisma + sqlite
  - 글 탐색 시 페이징 추가 ✅

2. 이후 Auth 추가, NextAuth 로 구현
- Credentials 구현
  - 비밀번호 해싱 ✅
  - JWT 처리 ✅

- 로그인 구현 ✅
- 로그아웃 구현 ✅
- 회원가입 구현 ✅

- 커스텀 로그인 페이지를 Client Component 로 바꾸어 error handle 보완하기
- login / sign up api handler 만들기

- OAuth 추가 (나중으로 계획)
  - Google
  - Naver
  - Kakao

3. Post, User Action 구현 ✅
  - 좋아요 기능 추가 ✅

4. PostgreSQL 로 데이터베이스 수정 ✅

5. 글 에디터 구현
  - Lexical 프레임워크 사용 ✅
  - 에디터에서 나오는 글 데이터를 데이터베이스에 저장하기 ✅
  - 목표 기능:
    - 굵은 글씨 ✅
    - 이텔릭체 ✅
    - 글 정렬 ✅
    - 링크 자동 첨부 ✅
    - 이미지 첨부
    - 유튜브 링크 ✅

6. 글 컴포넌트 구현
  - Lexical 기반 컴포넌트
    - JSON 파싱 ✅
    - JSON 렌더링 ✅
    - 글 데이터 띄우기 ✅
    - 유저 데이터 띄우기 ✅
 
7. 유저 페이지 구현
  - Shadcn/ui 의 컴포넌트 활용
  - Thread / Twitter 형식의 프로필 페이지로 지금까지 작성한 글이 띄워지는 프로필

8. 댓글 기능 추가 ✅
  - Comment Schema 추가 ✅
  - Comment Action 구현 ✅
  - Post 와 Comment 관계 설정 ✅
  - 좋아요 기능 추가 ✅
  - 대댓글 기능 추가 ✅

9. 댓글 에디터 구현
  - 글 에디터와 달라질 필요가 없다고 느껴 공통된 `LexicalTextEditor` 컴포넌트 사용 ✅

10. 댓글 컴포넌트 구현

11. 알림 기능 추가
  - 자기가 작성한 글에 댓글이 달리거나, 댓글에 답글이 달릴 시 알림이 뜨는 기능 추가

12. 유저 간 팔로우 기능 추가
  - Follow Schema 추가 ✅
  - Follow Action 구현 ✅

13. 유저 간 채팅 기능 추가
  - WebSocket 을 통한 채팅 추가
  - ChatRoom Schema 추가
  - ChatRoom Action 구현
  - 채팅 메세지 페이징(최근 20~30개 정도의 메세지만 fetch 후 추가 스크롤 시 추가 fetch) 구현

+ Nest.js 로 백엔드 로직을 옮기고 Prisma ORM 기반 Server Action 을 옮기는 것도 좋을 것 같음.
+ 공통된 로직이 많아지니 Nest.js 로 백엔드 로직을 옮기고 PassPort.js 로 Auth 관리를 하는 게 좋다고 생각.
+ React Native 로 모바일 앱까지 구현이 가능하다면 해도 좋다고 생각함 (추후 다른 포트폴리오를 개발하며 사이드로 할 듯)