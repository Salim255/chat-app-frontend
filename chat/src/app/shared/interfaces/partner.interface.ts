import { Member } from "./member.interface";

export type Partner =  Omit < Member, 'id' >  & {
  partner_id: number | null;
}
