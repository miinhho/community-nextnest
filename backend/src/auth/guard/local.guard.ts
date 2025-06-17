import { AuthGuard } from '@nestjs/passport';

/**
 * Local 전략을 사용한 인증 Guard 클래스
 *
 * 사용자명(이메일)과 비밀번호를 통한 로그인 인증을 처리합니다.
 * LocalStrategy와 함께 사용되어 사용자 자격 증명을 검증합니다.
 */
export class LocalAuthGuard extends AuthGuard('local') {}
