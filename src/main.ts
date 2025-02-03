import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './config/configuration';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser'; // Измененный импорт

async function bootstrap() {
  const start = Date.now();

  try {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);

    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());

    const config = new DocumentBuilder()
      .setTitle('Users API')
      .setDescription('The users API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const end = Date.now();
    const elapsed = end - start;

    console.log(
      `🚀 Server running on http://localhost:${appConfig.port ?? 3000} (started in ${elapsed}ms)`,
    );
  } catch (error) {
    console.error('❌ Error starting the application:', error);
  }
}

bootstrap();
