import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity('commissions')
export class Commission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  // связь Many-to-Many: одна комиссия может включать много пользователей,
  // и один пользователь может входить в несколько комиссий
  @ManyToMany(() => User, { eager: true })
  @JoinTable({
    name: 'commission_users', // таблица связей
    joinColumn: { name: 'commission_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  users: User[];
}
