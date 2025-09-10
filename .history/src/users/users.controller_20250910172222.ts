import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import Cu

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @Roles('admin')
    async createUser(
        @Body() body: { username: string; password: string; fio: string; post: string; role?: string },
    ) {
        const existing = await this.userService.findByUsername(body.username)
        if (existing) {
            return { message: 'Пользователь с таким username уже существует' }
        }

        const user = await this.userService.createUser(body)
        return { id: user.id, username: user.username, fio: user.fio, role: user.role }

    }

    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @Get()
    async getAllUsers() {
        const users = await this.userService.getAllUsers()
        return users
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@CurrentUser() user: any): Promise<User | null> {
        return this.userService.findOne(user.id);
    }



}
