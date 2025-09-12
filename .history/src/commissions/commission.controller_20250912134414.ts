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

  @Get()
  async getAll() {
    return this.commissionService.getAllCommissions();
  }

  @Post(':id/add-users')
  async addUsers(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { userIds: number[] },
  ) {
    return this.commissionService.addUsers(id, body.userIds);
  }

  @Post(':id/remove-user')
  async removeUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { userId: number },
  ) {
    return this.commissionService.removeUser(id, body.userId);
  }
}
