import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { TaskSign } from './task-sign.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from 'src/users/user.entity';
import { Commission } from 'src/commissions/commission.entity';

@Injectable()
export class TasksService {
  constructor(
      @InjectRepository(Task) private tasksRepo: Repository<Task>,
      @InjectRepository(TaskSign) private taskSignsRepo: Repository<TaskSign>,
      @InjectRepository(User) private usersRepo: Repository<User>,
      @InjectRepository(Commission) private commissionsRepo: Repository<Commission>,
  ) {}

    async create(body: CreateTaskDto, file: Express.Multer.File): Promise<Task> {
        const creator = await this.usersRepo.findOne({ where: { id: body.creatorId } });
        if (!creator) throw new NotFoundException('Creator not found');

        const commission = await this.commissionsRepo.findOne({
            where: { id: body.commissionId },
            relations: ['users'],
        });
        if (!commission) throw new NotFoundException('Commission not found');

        // создаем задачу
        const task = this.tasksRepo.create({
            title: dto.title,
            creator,
            commission,
            status: 'in_progress',
            filePath: file.filename,
        });
        await this.tasksRepo.save(task);

        // создаем записи о подписях для всех членов комиссии
        const signs = commission.users.map((user) =>
            this.taskSignsRepo.create({
                task,
                user,
                isSigned: false,
            }),
        );

        await this.taskSignsRepo.save(signs);

        // подгружаем обратно с relation
        return this.tasksRepo.findOneOrFail({
            where: { id: task.id },
            relations: ['creator', 'commission', 'signs', 'signs.user'],
        });
  }
}
