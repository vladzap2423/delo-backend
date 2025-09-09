import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('documents')
export class DocumentsController {
    constructor(private documentsService: DocumentsService) { }

    @UseGuards(JwtAuthGuard) // доступ только авторизованным
    @Post()
    async createDocument(
        @Body() body: { title: string; content: string },
        @Req() req,
    ) {
        const user = req.user; // получаем пользователя из JWT
        const document = await this.documentsService.createDocument(body, user);
        return {
            id: document.id,
            title: document.title,
            content: document.content,
            status: document.status,
            createdAt: document.createdAt,
        };
    }
}
