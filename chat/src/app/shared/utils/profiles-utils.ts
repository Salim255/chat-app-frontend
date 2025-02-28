import { Partner } from "../interfaces/partner.interface";

export class ProfileUtils {

  public static setProfileData(partner: any) {
    const { user_id, ...rest } = partner;

    const partnerInfo: Partner = {
      ...rest,
      partner_id: user_id,
    }

    return { ...partnerInfo }
  }

}
