export default class Config {
  private recycleEmailValue: string;

  private senderEmailValue: string;

  private userPoolIdValue: string;

  private appUrlValue: string;

  private emailSignatureValue: string;

  constructor() {
    this.recycleEmailValue = process.env.SES_RECYCLE_RECIPIENT_EMAIL ?? '';
    this.senderEmailValue = process.env.SES_SENDER_EMAIL ?? '';
    this.userPoolIdValue = process.env.COGNITO_USER_POOL_ID ?? '';
    this.appUrlValue = process.env.SES_APP_URL ?? '';
    this.emailSignatureValue = process.env.SES_EMAIL_SIGNATURE ?? '';
  }

  public get recycleEmail(): string {
    return this.recycleEmailValue;
  }

  public get senderDefaultEmail(): string {
    return this.senderEmailValue;
  }

  public get userPoolId(): string {
    return this.userPoolIdValue;
  }

  public get appUrl(): string {
    return this.appUrlValue;
  }

  public get emailSignature(): string {
    return this.emailSignatureValue;
  }
}
