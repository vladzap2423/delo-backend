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
    ) { }s

    async createUser(data: {
        username: string;
        password: string;
        fio: string;
        post: string;
        role?: string;
    }): Promise<User> {
        const hashedPassword = await bcrypt.hash(data.password, 10)

        const user = this.userRepository.create({
            username: data.username,
            password: hashedPassword,
            fio: data.fio,
            post: data.post,
            role: data.role
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
}
