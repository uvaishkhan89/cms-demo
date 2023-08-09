import { Column, Table, DataType } from "sequelize-typescript";
import { BaseModel } from "./base.model";

@Table({ tableName: 'states' })
export class State extends BaseModel {

    @Column(DataType.STRING)
    name: string;
}