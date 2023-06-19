import 'source-map-support/register'; //This import must remain on the first line
//Rest of app the imports
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as basicAuth from 'express-basic-auth';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { morganMiddleware } from './config/morgan-logger.config';
import { GlobalExceptionsFilter } from './filters/global-exception.filter';
import { RequestMetaService } from './interceptors/request-meta.service';

function setupSwagger(app: INestApplication, configService: ConfigService) {
  const options = new DocumentBuilder()
    .setTitle('NestJS Seed')
    .setDescription('NestSeed For Indexnine Technologies')
    .setVersion('0.1.0')
    .addSecurity('BearerAuthorization', {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: "Access token format: 'Bearer <access-token>'",
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);

  const authenticatedSwaggerUIUsers = configService.get('swagger.authUsers');
  const swaggerUIPath = configService.get('swagger.uiPath');
  //here /api-json is the default path of json generated by swagger
  app.use(
    [swaggerUIPath, '/api-json'],
    basicAuth({
      challenge: true,
      users: authenticatedSwaggerUIUsers,
    }),
  );

  SwaggerModule.setup(swaggerUIPath, app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.get('contextPath'));

  if (configService.get('swagger.isEnabled')) {
    setupSwagger(app, configService);
  }

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  app.use(morganMiddleware(configService.get('morgan.format')));

  const requestMetaService: RequestMetaService = app.get(RequestMetaService);

  app.useGlobalFilters(new GlobalExceptionsFilter(requestMetaService));

  app.use(compression());
  app.use(helmet());

  await app.listen(configService.get('PORT'));

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
