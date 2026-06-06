import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Indispensable pour que le Front-end l'appelle

  // Initialisation Swagger
  const config = new DocumentBuilder()
    .setTitle('PhysioAI API')
    .setDescription("API du backend de PhysioAI pour la gestion des patients et de l'analyse vidéo")
    .setVersion('1.0')
    .addTag('patients')
    .addTag('assessments')
    .build();
    
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
