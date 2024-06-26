import { ServerOptions, Server } from 'socket.io';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext, Logger } from '@nestjs/common';

import { AuthModule } from '@modules/auth/auth.module';
import { handshakeAuthMiddleware } from './middlewares';
import { GateWayModule } from './gateway.module';

import { IAuthService } from '@modules/auth/interfaces';
import { IGatewaySessionService } from './interfaces';
import { SERVICES, SOCKET_CLIENT_ID_HEADER } from '@utils/constants.util';

export class WSIoAdapter extends IoAdapter {
	private readonly logger = new Logger(WSIoAdapter.name);
	private readonly authService: IAuthService;
	private readonly gatewaySessionManager: IGatewaySessionService;

	constructor(private readonly app: INestApplicationContext) {
		super(app);
		this.authService = app
			.select(AuthModule)
			.get(SERVICES.AUTH_SERVICE, { strict: false });
		this.gatewaySessionManager = app
			.select(GateWayModule)
			.get(SERVICES.GATEWAY_SESSION_SERVICE, { strict: false });
	}

	createIOServer(port: number, options?: ServerOptions): any {
		const cors = {
			origin: process.env.BASE_URL_CLIENT,
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			allowedHeaders: [
				'Content-Type',
				'Authorization',
				SOCKET_CLIENT_ID_HEADER,
			],
			credentials: true,
		};

		this.logger.log(`Configuring SocketIO server with CORS options: `, {
			cors,
		});
		// this.logger.log(`Configuring SocketIO server with port: `, { port });

		const optionsWithCORS: ServerOptions = {
			...options,
			cors,
		};

		const server: Server = super.createIOServer(port, optionsWithCORS);

		server.use(
			handshakeAuthMiddleware(
				this.authService,
				this.logger,
				this.gatewaySessionManager,
			),
		);

		return server;
	}
}
