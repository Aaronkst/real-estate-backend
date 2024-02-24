import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

export const allowedOrigins: string | string[] = "*";

async function bootstrap() {
  // Create express app
  const app = await NestFactory.create(AppModule);

  // Cors
  app.enableCors({
    origin: allowedOrigins,
  });

  // Payload validation with Dto
  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: true,
    }),
  );

  // Start server
  await app.startAllMicroservices();
  await app.listen(3000, "0.0.0.0");
}
bootstrap();
