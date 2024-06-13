import {
	BadRequestException,
	Inject,
	Injectable,
	NestMiddleware,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';

import { IConversationService } from '../interfaces';

import { SERVICES } from '@utils/constants.util';
import { IAuthService } from '@modules/auth/interfaces';

@Injectable()
export class ConversationAccessMiddleware implements NestMiddleware {
	constructor(
		@Inject(SERVICES.CONVERSATION_SERVICE)
		private readonly conversationService: IConversationService,
		@Inject(SERVICES.AUTH_SERVICE)
		private readonly authService: IAuthService,
	) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const authHeader: string | undefined = req.headers['authorization'];
		if (!authHeader) throw new UnauthorizedException();

		const token = authHeader.split(' ')[1];
		if (!token) throw new UnauthorizedException();

		const user = await this.authService.verifyAccessToken(token);
		const id = req.params.id;
		if (!id) throw new BadRequestException('Invalid conversation id.');

		const hasAccess = await this.conversationService.hasAccess({
			id,
			userId: user.id,
		});
		if (!hasAccess) {
			throw new NotFoundException('Conversation was not found.');
		}

		next();
	}
}
