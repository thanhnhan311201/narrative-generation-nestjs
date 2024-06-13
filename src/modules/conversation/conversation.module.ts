import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Conversation } from '@configs/typeorm';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { ConversationAccessMiddleware } from './middlewares/conversation-access.middleware';

import { SERVICES, ROUTES } from '@utils/constants.util';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
	imports: [TypeOrmModule.forFeature([Conversation]), AuthModule],
	controllers: [ConversationController],
	providers: [
		{
			provide: SERVICES.CONVERSATION_SERVICE,
			useClass: ConversationService,
		},
	],
	exports: [
		{
			provide: SERVICES.CONVERSATION_SERVICE,
			useClass: ConversationService,
		},
	],
})
export class ConversationModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(ConversationAccessMiddleware)
			.forRoutes(`${ROUTES.CONVERSATION}/:id`);
	}
}
