import { BelongsTo, Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { State } from "./state.model";

@Table({ tableName: 'cities' })
export class City extends BaseModel { 
    @Column(DataType.STRING)
    name: string;
    
    @Column({ field: "state_id", type: DataType.INTEGER, allowNull: false })
    @ForeignKey(() => State)
    stateId: number

    @BelongsTo(() => State, 'stateId')
    state: State;
}