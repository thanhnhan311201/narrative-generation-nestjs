import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Inject,
	Param,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CurrentUser, SocketClientId } from '@modules/common/decorators';
import { UserDto } from '@modules/user/dtos';
import { CreatePromptDto } from './dtos/create-prompt.dto';

import { SERVICES, ROUTES, SERVER_EVENTS } from '@utils/constants.util';
import type { IQnAService } from './interfaces';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { STATUS } from '@modules/common/types';

@Controller(ROUTES.Q_N_A)
export class QnAController {
	constructor(
		@Inject(SERVICES.Q_N_A_SERVICE)
		private readonly qnAService: IQnAService,
		private readonly emitter: EventEmitter2,
	) {}

	@Post()
	@UseInterceptors(FileInterceptor('attachment'))
	@HttpCode(HttpStatus.CREATED)
	async createPrompt(
		@CurrentUser() user: UserDto,
		@UploadedFile() attachment: Express.Multer.File,
		@Param('id') id: string,
		@SocketClientId() clientId: string,
		@Body()
		{ content }: CreatePromptDto,
	) {
		if (!content) throw new BadRequestException('Can not create prompt');
		const params = { user, id, content, attachment };
		const response = await this.qnAService.createPrompt(params);

		this.emitter.emit(SERVER_EVENTS.PROMPT_CREATE, {
			response,
			clientId: clientId,
		});

		return { status: STATUS.SUCCESS };
	}
}
