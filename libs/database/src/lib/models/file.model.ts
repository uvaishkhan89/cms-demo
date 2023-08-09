import { Column, DataType, Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";

@Table({ tableName: 'files' })
export class File extends BaseModel {
    @Column(DataType.STRING)
    name: string;

    @Column(DataType.INTEGER)
    size: number;

    @Column(DataType.STRING)
    extension: string;

    @Column(DataType.STRING)
    mimetype: string;

    @Column(DataType.INTEGER)
    width: number;

    @Column(DataType.INTEGER)
    height: number;

    @Column(DataType.STRING)
    paths: string;
}