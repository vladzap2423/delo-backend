import { Module } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CommissionController } from './commission.controller';

@Module({
  controllers: [CommissionController],
  providers: [CommissionsService],
})
export class CommissionsModule {}
