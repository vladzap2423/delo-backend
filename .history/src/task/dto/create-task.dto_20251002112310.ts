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
    signArea?: {
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;

    
    signOrder: number[];
  };

}
