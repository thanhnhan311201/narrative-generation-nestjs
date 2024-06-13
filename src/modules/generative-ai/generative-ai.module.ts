import { Module } from '@nestjs/common';

import { Gemini15ProService } from './gemini-1_5-pro.service';

import { SERVICES } from '@utils/constants.util';
import { CloudStorageModule } from '@modules/cloud-storage/cloud-storage.module';
import { ConversationModule } from '@modules/conversation/conversation.module';

@Module({
	imports: [CloudStorageModule, ConversationModule],
	providers: [
		{
			provide: SERVICES.GENERATIVE_AI_SERVICE,
			useClass: Gemini15ProService,
		},
	],
	exports: [
		{
			provide: SERVICES.GENERATIVE_AI_SERVICE,
			useClass: Gemini15ProService,
		},
	],
})
export class GenerativeAIModule {}
