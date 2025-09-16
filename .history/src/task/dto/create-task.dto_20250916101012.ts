import { IsNotEmpty, IsNumber, IsString, Is } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber()
    creatorId: number;

    @IsNumber()
    commissionId: number;

}
