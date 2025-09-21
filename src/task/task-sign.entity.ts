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

  @Column({ nullable: true })
  page: number;

  @Column({ nullable: true, type: 'float' })
  x: number;

  @Column({ nullable: true, type: 'float' })
  y: number;

  @Column({ nullable: true, type: 'float' })
  width: number;

  @Column({ nullable: true, type: 'float' })
  height: number;
}
