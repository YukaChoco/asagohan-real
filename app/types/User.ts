import type { UserBestAsagohan, UserThisWeekAsagohan } from "./Asagohan";

export default interface User {
  id: string;
  name: string;
  accountID: string;
  userIconPath: string;
}

export interface UserProfile extends User {
  bestAsagohan: UserBestAsagohan;
  thisWeekAsagohans: UserThisWeekAsagohan[];
}
