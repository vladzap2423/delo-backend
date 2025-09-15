import { Controller, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { TasksService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/tmp', // временно кладём сюда
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async createTask(
    @Body() body: CreateTaskDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.tasksService.create(body, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
@Get()
async getAllTasks(): Promise<Task[]> {
  return this.tasksService.findAll();
}
}
