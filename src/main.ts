import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
	const logger = new Logger('Main (main.ts)');

	const app = await NestFactory.create(AppModule, {
		cors: {
			origin: process.env.BASE_URL_CLIENT,
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization'],
			credentials: true,
		},
	});
	app.setGlobalPrefix('api');
	app.use(helmet());
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		}),
	);
	await app.listen(process.env.PORT || 8080);

	logger.log(`Server running on port ${process.env.PORT || 8080}`);
}
bootstrap();
