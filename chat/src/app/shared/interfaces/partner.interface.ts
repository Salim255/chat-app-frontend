import { Member } from './member.interface';

export type Partner = Omit<Member, 'user_id'> & {
  partner_id: number | null;
};
