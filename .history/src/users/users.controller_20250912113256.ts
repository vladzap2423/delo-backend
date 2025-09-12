import { Controller, Post, Body, Get, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CurrentUser } from 'src/common/edcorators/user.decorator';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
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

    @UseGuards(JwtAuthGuard, RolesGuard)
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

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch(':id/status')
    async changeStatus(@Param('id') id: number, @Body() body: { isActive: boolean }) {
        return this.userService.updateStatus(id, body.isActive);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch(':id/role')
    async changeRole(@Param('id') id: number, @Body() body: { role: string }) {
        return this.userService.updateRole(id, body.role);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch(':id/password')
    async changePassword(@Param('id') id: number, @Body() body: { newPassword: string }) {
        return this.userService.updatePassword(id, body.newPassword);
    }

    @UseGuards(JwtAuthGuard)
    @Get('active')
    async getActiveUsers() {
        return this.userService.getActiveUsers();
    }

}
