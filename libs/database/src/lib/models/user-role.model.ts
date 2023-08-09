import { Column, DataType, Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { USER_ROLES_TYPE } from "apps/api/src/common/constants/user.constant";

@Table({ tableName: 'user_roles' })
export class UserRole extends BaseModel {
  @Column({
    type: DataType.ENUM({
      values: USER_ROLES_TYPE,
    }),
  })
  name: string;
    
  @Column(DataType.STRING)
  description: string;
}