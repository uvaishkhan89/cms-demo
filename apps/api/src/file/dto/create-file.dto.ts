import { IsNumber, IsString } from "class-validator";

export class CreateFileDto {
    @IsString()
    name: string;

    @IsNumber()
    size: number;

    @IsString()
    extension: string;

    @IsString()
    mimetype: string;

    @IsNumber()
    width: number;

    @IsNumber()
    height: number;

    @IsString()
    path: string;
}
