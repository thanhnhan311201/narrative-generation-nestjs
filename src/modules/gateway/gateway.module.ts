import { Module } from '@nestjs/common';

import { GatewaySessionService } from './gateway-session.service';
import { AuthModule } from '@modules/auth/auth.module';
import { SocketGateway } from './gateway.gateway';

import { SERVICES } from '@utils/constants.util';

@Module({
	imports: [AuthModule],
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
