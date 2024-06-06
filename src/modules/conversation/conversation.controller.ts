import { Controller, Inject } from '@nestjs/common';

import { IConversationService } from './interfaces';

import { SERVICES } from '@utils/constants.util';
import { ROUTES } from '@utils/constants.util';

@Controller(ROUTES.CONVERSATION)
export class ConversationController {
	constructor(
		@Inject(SERVICES.CONVERSATION_SERVICE)
		private readonly conversationService: IConversationService,
	) {}
}
