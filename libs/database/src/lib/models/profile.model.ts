import { Table, BelongsTo, Column, DataType, ForeignKey } from "sequelize-typescript";
import { GENDERS_LIST } from "apps/api/src/common/constants/user.constant";
import { BaseModel } from "./base.model";
import { User } from "./user.model";
import { City } from "./city.model";
import { File } from "./file.model";

@Table({ tableName: 'profiles' })
export class Profile extends BaseModel {
    
    @Column({ field: "user_id", type: DataType.INTEGER, allowNull: false })
    @ForeignKey(() => User)
    userId: number;

    @Column({ field: "profile_pic_id", type: DataType.INTEGER, allowNull: false })
    @ForeignKey(() => File)
    profilePicId: number;

    @Column(DataType.STRING)
    line_1: string;

    @Column(DataType.STRING)
    line_2: string;

    @Column(DataType.STRING)
    locality: string;

    @Column({ field: "city_id", type: DataType.INTEGER, allowNull: false })
    @ForeignKey(() => City)
    cityId: number;

    @Column({
        type: DataType.ENUM({
            values: GENDERS_LIST
        })
    })
    gender:string;

    @Column(DataType.STRING)
    qualification:string;

    @Column(DataType.STRING)
    latitude: string;

    @Column(DataType.STRING)
    longitude: string;

    @Column(DataType.STRING)
    linkedIn_url: string;

    @Column(DataType.STRING)
    facebook_url: string;

    @Column(DataType.INTEGER)
    zip: number;

    @BelongsTo(() => User, { foreignKey: 'userId' , as: 'UserData' })
    user: User;

    @BelongsTo(() => File, 'profilePicId')
    file: File;

    @BelongsTo(() => City, 'cityId')
    city: City;
}