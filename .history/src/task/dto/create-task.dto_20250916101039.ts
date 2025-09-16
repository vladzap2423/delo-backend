import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber()
    creatorId: number;

    @IsNumber()
    commissionId: number;

    @IsOptional()
    signSchema?: string;

}
