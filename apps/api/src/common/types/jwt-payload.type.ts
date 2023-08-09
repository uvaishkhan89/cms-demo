import { USER_ROLES } from "../constants/user.constant";

export type PayloadUser = {
  id: number;
  firstName: string;
  lastName: string;
  roleId: number;
  email: string;  
  mobile: string;
};

export type JwtPayload = {
  user: PayloadUser;
  ip: string;
  ua: string;
};
