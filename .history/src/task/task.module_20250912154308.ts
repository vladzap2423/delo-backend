import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskSignature } from './task-signature.entity';
import { Commission } from 'src/commissions/commission.entity';
import { User } from 'src/users/user.entity';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskSignature, Commission, User])],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
