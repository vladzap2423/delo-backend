import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber()
    creatorId: number;

    @IsNumber()
    commissionId: number;

    @
}
