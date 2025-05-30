export class DateUtils {
  static calculateAge(birthDate: Date | string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    return age;
  }
}
