import {
    Model,
    Column,
    PrimaryKey,
    DataType,
    CreatedAt,
    UpdatedAt,
    AllowNull,
    ForeignKey,
    BelongsTo,
    DeletedAt,
  } from 'sequelize-typescript';
import { User } from './user.model';
import { STATUS } from 'apps/api/src/common/constants/user.constant';

  export class BaseModel extends Model {
    @PrimaryKey
    @Column({
      type: DataType.INTEGER,    
      autoIncrement: true,    
    })
    override id:number;

    @AllowNull
    @Column({
      type: DataType.ENUM({
        values: Object.keys(STATUS),
      }),
      defaultValue: STATUS.ACTIVE,
    })
    status: STATUS;
  
    @CreatedAt
    @AllowNull
    @Column({field: "created_at"})
    override createdAt: Date;
  
    @UpdatedAt
    @AllowNull
    @Column({field: "updated_at"})
    override updatedAt: Date;

    // @DeletedAt
    // @AllowNull
    // @Column({field: "deleted_at"})
    // override deletedAt: Date;

    @AllowNull
    @Column({ field: "created_by", type: DataType.INTEGER })
    @ForeignKey(() => User)
    createdBy: number;
  
    @AllowNull
    @Column({ field: "updated_by", type: DataType.INTEGER })
    @ForeignKey(() => User)
    updatedBy: number;
  
    @AllowNull
    @Column({ field: "deleted_by", type: DataType.INTEGER })
    @ForeignKey(() => User)
    deletedBy: number;
  
    @BelongsTo(() => User, 'created_by')
    creator: User;
  }
  