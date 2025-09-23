import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Commission } from 'src/commissions/commission.entity';
import { TaskSign } from './task-sign.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  filePath: string;

  @ManyToOne(() => User, { eager: true })
  creator: User;

  @ManyToOne(() => Commission, { eager: true })
  commission: Commission;

  @OneToMany(() => TaskSign, (sign) => sign.task, { cascade: true })
  signs: TaskSign[];

  @Column({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: 'in_progress' })
  status: 'in_progress' | 'completed';

  @Column({ nullable: true })
  sigPath: string
}
