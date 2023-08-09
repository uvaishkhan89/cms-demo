import {
  Column,
  Model,
  Table,
  DataType,
  IsEmail,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { UserRole } from './user-role.model';
import { USER_ROLES } from 'apps/api/src/common/constants/user.constant';
import { type } from 'os';

@Table({ tableName: 'users' })
export class User extends BaseModel {
  
  @Column(DataType.STRING)
  first_name: string;

  @Column(DataType.STRING)
  last_name: string;

  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  mobile: string;

  @Column({
    type: DataType.STRING,
  })
  password: string;

  @Column({ field: "role_id", type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => UserRole)
  roleId: number;

  @BelongsTo(() => UserRole)
  role: UserRole;

  // @Column({
  //   type: DataType.ENUM({
  //     values: Object.keys(USER_ROLES),
  //   }),
  //   defaultValue: USER_ROLES.ADMIN,
  // })
  // role: USER_ROLES;

}
