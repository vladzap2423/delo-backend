import { Controller, Post, Get, Body, Param, ParseIntPipe } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('commissions')
export class CommissionController {
  constructor(private commissionService: CommissionService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() body: { name: string; userIds: number[] }) {
    return this.commissionService.createCommission(body.name, body.userIds);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async getAll() {
    return this.commissionService.getAllCommissions();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':id/add-users')
  async addUsers(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { userIds: number[] },
  ) {
    return this.commissionService.addUsers(id, body.userIds);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':id/remove-user')
  async removeUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { userId: number },
  ) {
    const result = await this.commissionService.removeUser(id, body.userId);
    if (!result) {
      return { message: 'Комиссия удалена, так как в ней не осталось пользователей' };
    }
    return result;
  }
}