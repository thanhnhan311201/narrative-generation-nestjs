import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Inject,
	Post,
} from '@nestjs/common';

import { Public } from '@modules/common/decorators';
import { STATUS } from '@modules/common/types';

import { IGenerativeAIService } from './interfaces';
import { SERVICES } from '@utils/constants.util';

@Controller('ai')
export class GenerativeAIController {
	constructor(
		@Inject(SERVICES.GENERATIVE_AI_SERVICE)
		private readonly aiService: IGenerativeAIService,
	) {}

	@Public()
	@Post('gen-story')
	@HttpCode(HttpStatus.OK)
	async googleLogin(@Body() body: { prompt: string }) {
		const text = await this.aiService.genStory(body.prompt);

		return { status: STATUS.SUCCESS, data: text };
	}
}
