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

    // создаем задачу с зоной для подписей
    const task = this.tasksRepo.create({
      title: body.title,
      creator,
      commission,
      status: 'in_progress',
      filePath: `uploads/tmp/${file.filename}`,
      signArea: body.signArea, // сохраняем общий прямоугольник
    });
    await this.tasksRepo.save(task);

    // если есть область и пользователи комиссии → делим её на слоты
    let signs: TaskSign[] = [];
    if (body.signArea && commission.users.length > 0) {
      const { page, x, y, width, height } = body.signArea;
      const slotHeight = height / commission.users.length;

      signs = commission.users.map((user, index) => {
        const slotRect = {
          page,
          x,
          y: y + index * slotHeight,
          width,
          height: slotHeight,
        };

        return this.taskSignsRepo.create({
          task,
          user,
          isSigned: false,
          slotIndex: index,
          slotRect,
          signOrder: body.signOrder ? body.signOrder[index] : index + 1,
        });
      });

      await this.taskSignsRepo.save(signs);
    }

    // подгружаем обратно с relation
    return this.tasksRepo.findOneOrFail({
      where: { id: task.id },
      relations: ['creator', 'commission', 'signs', 'signs.user'],
    });
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepo.find({
      relations: ['creator', 'commission', 'signs', 'signs.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateSignSchema(taskId: number, schema: string) {
    const task = await this.tasksRepo.findOne({
      where: { id: taskId },
      relations: ['signs', 'signs.user'],
    });
    if (!task) throw new NotFoundException('Task not found');

    let signSchema: any[];
    try {
      signSchema = JSON.parse(schema);
    } catch {
      throw new NotFoundException('Invalid schema JSON');
    }

    for (const s of task.signs) {
      const slot = signSchema.find((sc) => sc.userId === s.user.id);
      if (slot) {
        s.slotRect = {
          page: slot.page,
          x: slot.x,
          y: slot.y,
          width: slot.width,
          height: slot.height,
        };
        s.slotIndex = slot.slotIndex ?? s.slotIndex;
        s.signOrder = slot.signOrder ?? s.signOrder;
      }
    }

    await this.taskSignsRepo.save(task.signs);
    return this.tasksRepo.findOne({
      where: { id: taskId },
      relations: ['creator', 'commission', 'signs', 'signs.user'],
    });
  }
}
