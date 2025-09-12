import { Module } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CommissionsController } from './commission.controller';

@Module({
  controllers: [CommissionsController],
  providers: [CommissionsService],
})
export class CommissionsModule {}
