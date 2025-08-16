Backend:
  - [ ] Unit 테스트 추가
    - [x] auth controller 테스트
    - [x] block service 테스트
    - [ ] follow controller 테스트
    - [ ] notify controller 테스트
    - [ ] post controller 테스트
    - [ ] private controller 테스트
    - [ ] post-recommend service 테스트
    - [ ] user controller 테스트
  - [ ] Web push 를 이용한 백그라운드 알림
  - [ ] AWS S3 나 Cloudflare CDN 을 활용한 이미지 파일 저장
  - [ ] WebSocket 을 사용한 채팅
  - [ ] @nestjs/bullmq 를 이용한 채팅 캐싱
  - [ ] E2E 테스트 추가
  - [ ] 개인화된 추천 시스템 추가

Frontend:
  - [ ] LexicalViewer 컴포넌트 처리
    - [x] 글 컴포넌트 분리
    - [ ] 댓글 컴포넌트 분리
  - [ ] LexicalEditor 컴포넌트 처리
    - [ ] 글 컴포넌트 분리
    - [ ] 댓글 컴포넌트 분리
  - [ ] 유저 페이지 구현

Feature:
  - [ ] 유저 간 채팅 기능
  - [ ] 신고 기능
  - [ ] 관리자 패널 및 관리 기능

추천 시스템: 시간 + 인기 + 개인화
전체적으로 핫한 콘텐츠 ~200개를 미리 캐싱 (Nest.js caching)
요청 시점에는 팔로우 관계를 필터링해 팔로우 관계 점수를 합산해 Global : Follow = 6 : 4 로 재정렬. 

서로 팔로우 : + 20
일방 팔로우 : + 8
DM 을 주고 받았다면
- 10개 미만 : + 7
- 100개 미만 : + 15
- ~이상 : + 50
팔로우 유저의 글에 댓글마다 : + 4 
팔로우 유저의 글에 좋아요마다 : + 1 
