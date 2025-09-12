import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Commission } from 'src/commissions/commission.entity';
import { User } from 'src/users/user.entity';
import { TaskSignature } from './task-signature.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string; // оригинальное имя файла (например "report.pdf")

  @Column()
  filePath: string; // путь или URL (например "/uploads/123-report.pdf")

  @ManyToOne(() => User, { eager: true })
  createdBy: User; // кто создал задание

  @ManyToOne(() => Commission, { eager: true })
  commission: Commission; // комиссия, которая рассматривает задание

  @OneToMany(() => TaskSignature, (signature) => signature.task, {
    cascade: true,
  })
  signatures: TaskSignature[];

  @CreateDateColumn()
  createdAt: Date; // дата создания
}
