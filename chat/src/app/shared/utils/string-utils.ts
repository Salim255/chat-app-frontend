export class StringUtils {
  public static getAvatarUrl (avatar: string | null): string {
    if (avatar) {
      return `https://intimacy-s3.s3.eu-west-3.amazonaws.com/users/${avatar}`
    } else  {
       return 'assets/images/default-profile.jpg';
    }
  }
}
