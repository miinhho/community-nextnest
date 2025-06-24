Backend:
  - [x] PassPort.js 로 Auth 구현
  - [x] JWT 구현
  - [x] Comment Controller
  - [x] Post Controller
  - [x] User Controller
  - [x] Follow Controller
  - [x] Logger 추가
  - [x] Repository 패턴 확장
  - [x] Swagger Docs
  - [ ] 알림 Schema 및 서비스 만들기
  - [ ] WebSocket 을 사용한 채팅, 알림 시스템
  - [ ] Web push 를 이용한 백그라운드 알림
  - [ ] AWS S3 나 Cloudflare CDN 을 활용한 이미지 파일 저장


Frontend:
  - [x] React Query 용 쿼리 함수 구현
  - [ ] Zustand 를 통해 유저 Auth 정보를 저장 및 사용
  - [ ] 글 컴포넌트 구현
  - [ ] 유저 페이지 구현
  - [ ] 댓글 컴포넌트 구현
  - [ ] 글 페이지에 댓글 컴포넌트 추가
  - [ ] 댓글 에디터 구현

Feature:
  - [ ] 차단 기능
  - [ ] 유저 간 채팅 기능
  - [ ] 알람 기능

+ React Native 로 모바일 앱까지 구현이 가능하다면 해도 좋다고 생각함 (추후 다른 포트폴리오를 개발하며 사이드로 할 듯)
+ React Native 로 개발할 시 Webhook 으로 하던지, 아니면 Lexical 에디터 구현을 좀 고생해서 스타일 리펙토링을 할 듯
+ React Native 로 한다면 Expo 기반으로 추진할 예정이기 때문에, 백그라운드 알림을 ExpoPushMessage 로 구현할 예정