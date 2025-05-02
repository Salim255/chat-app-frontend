export class StringUtils {
  public static getAvatarUrl(avatar: string | null): string {
    if ( !avatar ||  avatar?.trim()?.length === 0 ) {
      return 'assets/images/default-profile.jpg';
    } else {
      return `https://intimacy-s3.s3.eu-west-3.amazonaws.com/users/${avatar}`;
    }
  }

  public static getMessageIcon(messageStatus: string): string {
    switch (messageStatus) {
      case 'read':
        return 'checkmark-done-outline';
      case 'delivered':
        return 'checkmark-done-outline';
      default:
        return 'checkmark-outline';
    }
  }
}
