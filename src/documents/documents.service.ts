import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { User } from '../users/user.entity';

@Injectable()
export class DocumentsService {
    constructor(
        @InjectRepository(Document)
        private documentsRepository: Repository<Document>,
    ) { }

    async createDocument(
        data: { title: string; content: string },
        creator: User,
    ): Promise<Document> {
        const document = this.documentsRepository.create({
            title: data.title,
            content: data.content,
            creator,
        });

        return this.documentsRepository.save(document);
    }
}
