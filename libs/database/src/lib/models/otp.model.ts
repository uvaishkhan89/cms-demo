import { Column, DataType, Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { EMAIL_TYPES_LIST } from "apps/api/src/common/constants/user.constant";

@Table({ tableName: 'otps' })
export class Otp extends BaseModel {
  @Column(DataType.INTEGER)
  otp: number;

  @Column(DataType.STRING)
  email: string;

  @Column({
    type: DataType.ENUM({
        values: EMAIL_TYPES_LIST,
    }),
  })
  type: string
}