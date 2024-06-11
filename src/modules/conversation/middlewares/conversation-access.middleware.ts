import {
	BadRequestException,
	Inject,
	Injectable,
	NestMiddleware,
	NotFoundException,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';

import { IConversationService } from '../interfaces';

import { AuthenticatedRequest } from '@modules/common/types';
import { SERVICES } from '@utils/constants.util';

@Injectable()
export class ConversationAccessMiddleware implements NestMiddleware {
	constructor(
		@Inject(SERVICES.CONVERSATION_SERVICE)
		private readonly conversationService: IConversationService,
	) {}

	async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
		const { id: userId } = req.user;
		const id = req.params.id;
		if (!id) throw new BadRequestException('Invalid conversation id.');

		const hasAccess = await this.conversationService.hasAccess({ id, userId });
		if (!hasAccess) {
			throw new NotFoundException('Conversation was not found.');
		}

		next();
	}
}
