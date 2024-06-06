import { Module } from '@nestjs/common';

import { GatewaySessionService } from './gateway-session.service';
import { AuthModule } from '@modules/auth/auth.module';

import { SERVICES } from '@utils/constants.util';

@Module({
	imports: [AuthModule],
	providers: [
		{
			provide: SERVICES.GATEWAY_SESSION_SERVICE,
			useClass: GatewaySessionService,
		},
	],
	exports: [
		{
			provide: SERVICES.GATEWAY_SESSION_SERVICE,
			useClass: GatewaySessionService,
		},
	],
})
export class GateWayModule {}
