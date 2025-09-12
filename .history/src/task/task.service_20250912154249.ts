import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Task } from './task.entity';
import { TaskSignature } from './task-signature.entity';
import { Commission } from 'src/commissions/commission.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,

    @InjectRepository(TaskSignature)
    private readonly signatureRepo: Repository<TaskSignature>,

    @InjectRepository(Commission)
    private readonly commissionRepo: Repository<Commission>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Создать задание
  async createTask(
    fileName: string,
    filePath: string,
    createdById: number,
    commissionId: number,
  ): Promise<Task> {
    const creator = await this.userRepo.findOne({ where: { id: createdById } });
    if (!creator) throw new NotFoundException('Создатель не найден');

    const commission = await this.commissionRepo.findOne({
      where: { id: commissionId },
      relations: ['users'],
    });
    if (!commission) throw new NotFoundException('Комиссия не найдена');

    // создаём задание
    const task = this.taskRepo.create({
      fileName,
      filePath,
      createdBy: creator,
      commission,
    });
    const savedTask = await this.taskRepo.save(task);

    // создаём подписи для всех участников комиссии
    const signatures = commission.users.map((u) =>
      this.signatureRepo.create({ task: savedTask, user: u }),
    );
    await this.signatureRepo.save(signatures);

    return this.taskRepo.findOne({
      where: { id: savedTask.id },
      relations: ['signatures', 'signatures.user', 'commission', 'createdBy'],
    });
  }

  // Получить все задания
  async getAllTasks(): Promise<Task[]> {
    return this.taskRepo.find({
      relations: ['signatures', 'signatures.user', 'commission', 'createdBy'],
    });
  }

  // Получить одно задание
  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['signatures', 'signatures.user', 'commission', 'createdBy'],
    });
    if (!task) throw new NotFoundException('Задание не найдено');
    return task;
  }

  // Подписать задание
  async signTask(taskId: number, userId: number): Promise<TaskSignature> {
    const signature = await this.signatureRepo.findOne({
      where: { task: { id: taskId }, user: { id: userId } },
      relations: ['task', 'user'],
    });

    if (!signature) throw new NotFoundException('Подпись не найдена');

    signature.signed = true;
    signature.signedAt = new Date();

    return this.signatureRepo.save(signature);
  }
}
