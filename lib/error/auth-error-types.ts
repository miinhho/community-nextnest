export enum CustomAuthError {
  Configuration = "Configuration",
  AccessDenied = "AccessDenied",
  Verification = "Verification",
  Default = "Default",
}

export class UserNotFound extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class UserPasswordInvalid extends Error {
  constructor(message?: string) {
    super(message);
  }
}
