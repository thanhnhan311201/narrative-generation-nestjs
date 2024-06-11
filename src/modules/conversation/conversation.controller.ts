import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Param,
	Post,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { IConversationService } from './interfaces';
import { CurrentUser, SocketClientId } from '@modules/common/decorators';
import { CreateConversationDto } from './dtos/create-conversation.dto';
import { UserDto } from '@modules/user/dtos';

import { SERVER_EVENTS, SERVICES } from '@utils/constants.util';
import { ROUTES } from '@utils/constants.util';
import { STATUS } from '@modules/common/types';

@Controller(ROUTES.CONVERSATION)
export class ConversationController {
	constructor(
		@Inject(SERVICES.CONVERSATION_SERVICE)
		private readonly conversationService: IConversationService,
		private readonly emitter: EventEmitter2,
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async createConversation(
		@CurrentUser() user: UserDto,
		@Body() body: CreateConversationDto,
		@SocketClientId() clientId: string,
	) {
		const conversation = await this.conversationService.createConversation(
			user,
			body,
		);
		this.emitter.emit(SERVER_EVENTS.CONVERSATION_CREATE, {
			clientId,
			conversation,
		});
		return { status: STATUS.SUCCESS };
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	async getConversations(@CurrentUser() user: UserDto) {
		const conversations = await this.conversationService.getConversations(
			user.id,
		);

		return { status: STATUS.SUCCESS, data: { conversations } };
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	async getConversationContent(@Param('id') id: string) {
		const conversationContent =
			await this.conversationService.getConversationContent(id);

		return { status: STATUS.SUCCESS, data: { conversationContent } };
	}
}
