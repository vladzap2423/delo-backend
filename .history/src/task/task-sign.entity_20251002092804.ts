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
  
  @Column({ type: 'jsonb', nullable: true })
  slotRect: {
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
