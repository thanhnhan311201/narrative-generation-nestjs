import { Module } from '@nestjs/common';

import { GenerativeAIController } from './generative-ai.controller';
import { Gemini15ProService } from './gemini-1_5-pro.service';

import { SERVICES } from '@utils/constants.util';

@Module({
	imports: [],
	controllers: [GenerativeAIController],
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
