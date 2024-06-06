import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { join } from 'path';

import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { GenerativeAIModule } from '@modules/generative-ai/generative-ai.module';
import { CloudStorageModule } from '@modules/cloud-storage/cloud-storage.module';
import { ConversationModule } from '@modules/conversation/conversation.module';
import { QnAModule } from '@modules/q&a/q&a.module';
import { GateWayModule } from '@modules/gateway/gateway.module';
import { EventModule } from '@modules/event/event.module';

import { JwtAuthGuard } from '@modules/common/guards';

import rootConfig from '@configs/env/';
import { entities } from '@configs/typeorm';

@Module({
	imports: [
		ConfigModule.forRoot(rootConfig),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'client'),
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.POSTGRES_HOST,
			port: Number(process.env.POSTGRES_PORT),
			database: process.env.POSTGRES_DB,
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			entities: entities,
			synchronize: true, // does not allow in production, have to migrate database
			// logging: 'all',
		}),
		UserModule,
		AuthModule,
		GenerativeAIModule,
		CloudStorageModule,
		ConversationModule,
		QnAModule,
		EventEmitterModule.forRoot(),
		EventModule,
		GateWayModule,
	],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AppModule {}
