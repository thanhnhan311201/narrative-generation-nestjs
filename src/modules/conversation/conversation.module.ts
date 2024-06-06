import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Conversation } from '@configs/typeorm';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';

import { SERVICES } from '@utils/constants.util';

@Module({
	imports: [TypeOrmModule.forFeature([Conversation])],
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
export class ConversationModule {}
