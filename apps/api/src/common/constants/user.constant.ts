export enum EMAIL_TYPES {
    LOGIN = 'LOGIN', 
    VERIFICATION = 'VERIFICATION', 
    FORGOT_PASSWORD = 'FORGOT_PASSWORD'
}

export const APPLICATION_NAME = 'cms-demo';

export enum STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

export const STATUS_LIST = Object.keys(STATUS);

export const EMAIL_TYPES_LIST = Object.keys(EMAIL_TYPES);

export enum USER_ROLES {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER'
}

export const USER_ROLES_TYPE = Object.keys(USER_ROLES)

export enum GENDERS {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
}
  
export const GENDERS_LIST = Object.keys(GENDERS);

export const SORT_ORDER = {
    ASC: 'ASC',
    DESC: 'DESC',
};
  
export const SORT_ORDER_LIST =  Object.keys(SORT_ORDER);

export const OTP_PURPOSE = {
  LOGIN: 'LOGIN',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  VERIFICATION: 'VERIFICATION',
};

export const OTP_PURPOSE_LIST = (() => Object.keys(OTP_PURPOSE))();

export const RESPONSE = {
    SUCCESS: true,
    ERROR: false,
  };

export const MESSAGE = {
LOGIN: {
    INVALID_CREDENTIALS: 'Wrong Email or Password',
    SUCCESS: 'Successfully logged in',    
  },
  USER: {
    FAILED: 'Registration failed. Pls try again.',
    SUCCESS: 'Successfully Saved',
    EMAIL_EXIST:'Email ID already exist',
    EMAIL_NOT_EXIST:'Email ID Does Not exist',
    PHONE_EXIST:'Phone Number already exist',
    NOT_FOUND: 'User not Found',
    DELETE: 'Deleted Successfully',
    UPDATE: 'Updated Successfully',
    OTP_NOT_MATCH: 'Otp Does Not Match',
    OTP_MATCH: 'Otp Verify Successfully',
    OTP_SEND: 'Otp Send Successfully',
    PASSWORD_SUCCESS: 'Forgot Password Successfully',
    INVALID_CREDENTIAL: 'Invalid Credential',
    UPDATE_PASSWORD: 'Password Update Successfully',
  },
}
