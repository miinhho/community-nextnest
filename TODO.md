Backend:
  - [ ] 추천 시스템 추가
  - [ ] Web push 를 이용한 백그라운드 알림
  - [ ] AWS S3 나 Cloudflare CDN 을 활용한 이미지 파일 저장
  - [ ] WebSocket 을 사용한 채팅
  - [ ] @nestjs/bullmq 를 이용한 채팅 캐싱

Frontend:
  - [ ] 페이지 MVP 구현
  - [ ] LexicalViewer 컴포넌트 처리
    - [ ] 글 컴포넌트 분리
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
아래와 같은 로직으로 계산 후 hot score 순으로 7일 내의 게시글만 정렬 후 상단 콘텐츠는 캐싱. 
```js
function calculateHotScore(likeCount, createdAt) {
    const SECONDS_IN_HOUR = 3600;
    const baseTime = new Date('2024-01-01T00:00:00Z').getTime();
    const postTime = new Date(createdAt).getTime();
    const hoursSince = (postTime - baseTime) / (1000 * SECONDS_IN_HOUR);

    return likeCount / Math.pow(hoursSince + 2, 1.5);
}
```

요청 시점에는 팔로우 관계를 필터링해 팔로우 관계 점수를 합산해 Global : Follow = 6 : 4 로 재정렬. 

서로 팔로우 : +20
일방 팔로우 : +8
DM 을 주고 받았다면
- 10개 미만 : + 7
- 100개 미만 : + 15
- ~이상 : + 50
팔로우 유저의 글에 댓글마다 : + 4 
팔로우 유저의 글에 좋아요마다 : + 1 
