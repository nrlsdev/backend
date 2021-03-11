export interface ApplicationUserEmailAndPasswordAccount {
  email: string;

  password: string;

  activationCode?: string;

  activated: boolean;
}
