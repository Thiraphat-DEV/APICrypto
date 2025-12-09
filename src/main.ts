import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerDocumentOptions, SwaggerModule} from "@nestjs/swagger";
import {ValidationPipe} from "@nestjs/common";
import {MicroserviceOptions, Transport } from '@nestjs/microservices';
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(process.env.PORT ?? 3200);
// }
// bootstrap();

async function bootstrap() {
  try {
    const port = 3200;
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 8005,
      },
    });
    await app.startAllMicroservices();

    const config = new DocumentBuilder()
        .setTitle(`Open API`)
        .setDescription(`Open API`)
        .setVersion('1.0.0')
        .setBasePath('open-api')
        .addServer(`http://localhost:${port}`, `Debug Only`)
        .addOAuth2({
          bearerFormat: 'JWT',
          in: 'header',
          type: 'openIdConnect',
          name: 'token',
          description: 'Default JWT Authorization',
          scheme: 'bearer',
        })
        .build();
    const options: SwaggerDocumentOptions = {
      deepScanRoutes: true,
    };
    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('/open-api', app, document, {
      explorer: true,
      customSiteTitle: 'API Crypto',
      useGlobalPrefix: true,
      swaggerOptions: {
        defaultModelsExpandDepth: -1,
        docExpansion: false,
        persistAuthorization: true,
      },
    });

    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
    console.log(
        `Open API is running on: http://localhost:${port}/open-api`,
    );
  } catch (err) {
    console.log(err);
  }
}

bootstrap();
