import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
    exposedHeaders: 'set-cookie',
  });

  // включаем глобально @Exclude/@Expose
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const port = process.env.API_PORT;
  if (port) {
    await app.listen(port, "");
  }

  console.log(`🚀 Server is running on http://localhost:${port}`);

  // Автосоздание админа
  const usersService = app.get(UsersService);
  const admin = await usersService.findByUsername('gp1Admin');
  if (!admin) {
    await usersService.createUser({
      username: 'gp1Admin',
      password: '123qweQWE',
      fio: 'Администратор',
      post: 'Администратор',
      role: 'admin',
    });
    console.log('✅ Администратор gp1Admin создан');
  }
}
bootstrap();
