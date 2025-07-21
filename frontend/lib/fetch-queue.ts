interface FetchQueueItem {
  resolve: (value: string) => void;
  reject: (reason: any) => void;
}

class FetchQueue {
  private static instance: FetchQueue;
  private isRefresh = false;

  // 실패한 요청을 저장하는 큐
  private failedQueue: FetchQueueItem[] = [];

  private constructor() {}

  /**
   * FetchQueue의 싱글톤 인스턴스를 반환합니다.
   */
  static getInstance(): FetchQueue {
    if (!FetchQueue.instance) {
      FetchQueue.instance = new FetchQueue();
    }
    return FetchQueue.instance;
  }

  /**
   * 현재 토큰 재발급 중인지 여부를 반환합니다.
   */
  get isRefreshing() {
    return this.isRefresh;
  }

  /**
   * 토큰 재발급을 시작합니다.
   */
  startRefreshing() {
    this.isRefresh = true;
  }

  /**
   * 토큰 재발급을 완료합니다.
   */
  finishRefreshing() {
    this.isRefresh = false;
  }

  /**
   * 실패한 요청을 큐에 추가합니다.
   */
  addToQueue() {
    return new Promise((resolve, reject) => {
      this.failedQueue.push({ resolve, reject });
    });
  }

  /**
   * 실패한 요청들을 성공적으로 처리한 후, 큐를 비웁니다.
   * @param token - 새로 발급된 토큰
   */
  resolveQueue(token: string) {
    this.failedQueue.forEach(({ resolve }) => {
      resolve(token);
    });
    this.clearQueue();
  }

  /**
   * 실패한 요청들을 실패로 처리하고, 큐를 비웁니다.
   * @param error - 처리 실패 시의 에러
   */
  rejectQueue(error: any) {
    this.failedQueue.forEach(({ reject }) => {
      reject(error);
    });
    this.clearQueue();
  }

  /**
   * 실패한 요청 큐를 비웁니다.
   */
  private clearQueue() {
    this.failedQueue = [];
  }
}

export const fetchQueue = FetchQueue.getInstance();
