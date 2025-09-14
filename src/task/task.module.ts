import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskSign } from './task-sign.entity';
import { Commission } from 'src/commissions/commission.entity';
import { User } from 'src/users/user.entity';
import { TasksService } from './task.service';
import { TasksController } from './task.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskSign, Commission, User])],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule { }
