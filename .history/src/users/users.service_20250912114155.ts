import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async createUser(data: {
        username: string;
        password: string;
        fio: string;
        post: string;
    }): Promise<User> {
        const hashedPassword = await bcrypt.hash(data.password, 10)

        const user = this.userRepository.create({
            username: data.username,
            password: hashedPassword,
            fio: data.fio,
            post: data.post,
        })

        return this.userRepository.save(user)
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { username } })
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find({
            select: ['id', 'username', 'post', 'fio', 'role', 'isActive']
        })
    }

    async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
    }

    async updateStatus(id: number, isActive: boolean): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) return null;

        user.isActive = isActive;
        return this.userRepository.save(user);
    }

    async updateRole(id: number, role: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) return null;

        user.role = role;
        return this.userRepository.save(user);
    }

    async updatePassword(id: number, newPassword: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) return null;

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        return this.userRepository.save(user);
    }
    async getActiveUsers(): Promise<User[]> {
    return this.userRepository.find({
        where: { isActive: true },
        select: ['id', 'username', 'post', 'fio', 'role'], // без пароля и лишнего
    });
    }

}
