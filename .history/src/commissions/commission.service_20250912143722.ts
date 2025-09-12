import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Commission } from './commission.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class CommissionService {
  constructor(
    @InjectRepository(Commission)
    private commissionRepo: Repository<Commission>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // Создать комиссию с набором пользователей
  async createCommission(name: string, userIds: number[]): Promise<Commission> {
    const users = await this.userRepo.find({ where: { id: In(userIds), isActive: true } });

    const commission = this.commissionRepo.create({ name, users });
    return this.commissionRepo.save(commission);
  }

  // Получить все комиссии
  async getAllCommissions(): Promise<Commission[]> {
    return this.commissionRepo.find();
  }

  // Добавить пользователей в комиссию
  async addUsers(commissionId: number, userIds: number[]): Promise<Commission> {
    const commission = await this.commissionRepo.findOne({
      where: { id: commissionId },
      relations: ['users'],
    });
    if (!commission) throw new NotFoundException('Комиссия не найдена');

    const users = await this.userRepo.find({ where: { id: In(userIds), isActive: true } });
    commission.users = [...commission.users, ...users];

    return this.commissionRepo.save(commission);
  }

  // Удалить пользователя из комиссии
  async removeUser(commissionId: number, userId: number): Promise<Commission | null> {
    const commission = await this.commissionRepo.findOne({
      where: { id: commissionId },
      relations: ['users'],
    });
    if (!commission) throw new NotFoundException('Комиссия не найдена');

    commission.users = commission.users.filter((u) => u.id !== userId);

    return this.commissionRepo.save(commission);
  }
}
