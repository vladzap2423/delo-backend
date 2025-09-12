import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commission } from './commission.entity';
import { User } from 'src/users/user.entity';
import { CommissionService } from './commission.service';
import { CommissionController } from './commission.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Commission, User])],
  providers: [CommissionService],
  controllers: [CommissionController],
})
export class CommissionModule {}
