import { Inject, Injectable } from '@nestjs/common';

import { IGatewaySessionService } from '@modules/gateway/interfaces';

import { SERVICES } from '@utils/constants.util';

@Injectable()
export class ConversationEvent {
	constructor(
		@Inject(SERVICES.GATEWAY_SESSION_SERVICE)
		private readonly gatewaySessionService: IGatewaySessionService,
	) {}
}
