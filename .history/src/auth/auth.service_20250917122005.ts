import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string) {
        const user = await this.userService.findByUsername(username)
        if (!user) {
            throw new UnauthorizedException("Неверный логин!");
        }

        const isPasswordMatching = await bcrypt.compare(password, user.password)
        if (!isPasswordMatching) {
            throw new UnauthorizedException("Неверный пароль!");
        }

        if (!user.isActive) {
            throw new UnauthorizedException("Пользователь деактивирован!");
        }

        return user
    }

    async login(user: any) {
        const payload = { sub: user.id, username: user.username, fio: user.fio, role: user.role, isActive: user.isActive }
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
