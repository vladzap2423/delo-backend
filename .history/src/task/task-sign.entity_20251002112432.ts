import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Task } from './task.entity';

@Entity('task_signs')
export class TaskSign {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task, (task) => task.signs, { onDelete: 'CASCADE' })
  task: Task;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({ default: false })
  isSigned: boolean;

  @Column({ nullable: true })
  signedAt: Date;

  // Порядковый индекс ячейки в общем прямоугольнике
  @Column({ type: 'int', nullable: true })
  slotIndex: number;

  // Прямоугольник, выделенный под подпись конкретного пользователя
  @Column({ type: 'jsonb', nullable: true })
  slotRect: {
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
  };

  // Очерёдность подписания (задана на фронте)
  @Column({ type: 'int', nullable: true })
  signOrder: number;
}
