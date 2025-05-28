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

- OAuth 추가 (나중으로 계획)
  - Google
  - Naver
  - Kakao

3. Post, User Action 구현 ✅

4. PostgreSQL 로 데이터베이스 수정 ✅

5. 글 에디터 구현
  - Lexical 프레임워크 사용
  - 에디터에서 나오는 글 데이터를 데이터베이스에 저장하기
  - (Post 관련 추가적인 Action 구현이 이루어질 것으로 예상) 

6. 글 컴포넌트 구현
 
7. 유저 페이지 구현
  - Shadcn/ui 의 컴포넌트 활용
  - Thread / Twitter 형식의 프로필 페이지로 지금까지 작성한 글이 띄워지는 프로필

8. 댓글 기능 추가
  - Comment Schema 추가
  - Comment Action 구현
  - Post 와 Comment 관계 설정

9. 댓글 에디터 구현
  - Lexical 프레임워크 사용
  - 글에서 사용하는 에디터보다 적은 기능을 넣도록 하기

10. 댓글 컴포넌트 구현

11. 알림 기능 추가
  - 자기가 작성한 글에 댓글이 달리거나, 댓글에 답글이 달릴 시 알림이 뜨는 기능 추가

12. 유저 간 친구 기능 추가
  - User Schema 추가
  - Friend Action 구현

13. 유저 간 채팅 기능 추가
  - WebSocket 을 통한 채팅 추가
  - ChatRoom Schema 추가
  - ChatRoom Action 구현
  - 채팅 메세지 페이징 구현

+ React Native 로 모바일 앱까지 구현이 가능하다면 해도 좋다고 생각함 (추후 다른 포트폴리오를 개발하며 사이드로 할 듯)