import { Module } from '@nestjs/common';

import { GatewaySessionService } from './gateway-session.service';
import { AuthModule } from '@modules/auth/auth.module';
import { SocketGateway } from './gateway.gateway';

import { SERVICES } from '@utils/constants.util';
import { ConversationModule } from '@modules/conversation/conversation.module';
import { QnAModule } from '@modules/q&a/q&a.module';
import { GenerativeAIModule } from '@modules/generative-ai/generative-ai.module';

@Module({
	imports: [AuthModule, ConversationModule, QnAModule, GenerativeAIModule],
	providers: [
		SocketGateway,
		{
			provide: SERVICES.GATEWAY_SESSION_SERVICE,
			useClass: GatewaySessionService,
		},
	],
	exports: [
		SocketGateway,
		{
			provide: SERVICES.GATEWAY_SESSION_SERVICE,
			useClass: GatewaySessionService,
		},
	],
})
export class GateWayModule {}
