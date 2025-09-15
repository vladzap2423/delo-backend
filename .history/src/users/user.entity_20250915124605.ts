import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    @Exclude()
    password: string;

    @Column()
    fio: string;

    @Column()
    post: string;

    @Column({ default: 'user' })
    role: string;

    @Column({ default: true })
    isActive: boolean;

}
