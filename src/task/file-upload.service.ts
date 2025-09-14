import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class FileUploadService {
    static fileFilter(req, file, cb) {
        const allowedMimes = ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (!allowedMimes.includes(file.mimetype)) {
            return cb(new Error('Only PDF or Excel files are allowed'), false);
        }
        cb(null, true);
    }

    static storage = diskStorage({
        destination: './uploads', // Папка для хранения файлов
        filename: (req, file, cb) => {
            const filename = `${Date.now()}${extname(file.originalname)}`;
            cb(null, filename);
        },
    });
}
