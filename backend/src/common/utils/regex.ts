/**
 * 영문자와 숫자가 모두 포함되어야 하는 정규식
 *
 * 비밀번호 등에서 영문자와 숫자 조합을 검증할 때 사용됩니다.
 *
 * @example
 * ```typescript
 * alphabetNumbericRegex.test('abc123'); // true
 * alphabetNumbericRegex.test('abc');    // false
 * alphabetNumbericRegex.test('123');    // false
 * ```
 */
export const alphabetNumbericRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;

/**
 * 특수문자를 검증하는 정규식
 *
 * 일반적인 특수문자들을 포함하는지 확인할 때 사용됩니다.
 *
 * @example
 * ```typescript
 * specialCharRegex.test('hello!');     // true
 * specialCharRegex.test('hello@');     // true
 * specialCharRegex.test('hello');      // false
 * ```
 */
export const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
