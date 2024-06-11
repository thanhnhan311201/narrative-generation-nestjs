import { Module } from '@nestjs/common';

import { GateWayModule } from '@modules/gateway/gateway.module';

import { ConversationEvent } from './conversation.event';

@Module({
	imports: [GateWayModule],
	providers: [ConversationEvent],
})
export class EventModule {}
