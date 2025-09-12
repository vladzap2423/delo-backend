import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Task } from './task.entity';
import { User } from 'src/users/user.entity';

@Entity('task_signatures')
export class TaskSignature {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task, (task) => task.signatures, { onDelete: 'CASCADE' })
  task: Task;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({ default: false })
  signed: boolean;

  @Column({ nullable: true })
  signedAt: Date;
}
