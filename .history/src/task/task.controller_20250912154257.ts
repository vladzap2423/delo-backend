import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // Создать задание
  @Post()
  async createTask(
    @Body()
    body: {
      fileName: string;
      filePath: string;
      createdById: number;
      commissionId: number;
    },
  ) {
    return this.taskService.createTask(
      body.fileName,
      body.filePath,
      body.createdById,
      body.commissionId,
    );
  }

  // Получить все задания
  @Get()
  async getAll() {
    return this.taskService.getAllTasks();
  }

  // Получить одно задание
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.getTaskById(id);
  }

  // Подписать задание
  @Post(':id/sign')
  async sign(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { userId: number },
  ) {
    return this.taskService.signTask(id, body.userId);
  }
}
