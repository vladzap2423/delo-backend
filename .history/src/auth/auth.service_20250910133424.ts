import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { use } from 'passport';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { access } from 'fs';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string) {
        const user = await this.userService.findByUsername(username)
        if (!user) return null

        const isPasswordMatching = await bcrypt.compare(password, user.password)
        if (!isPasswordMatching) return null

        return user
    }

    async login(user: any) {
        const payload = { sub: user.id, username: user.username, role: user.role, fio: user.fio }
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
