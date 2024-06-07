import { Inject, Logger } from '@nestjs/common';
import {
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';

import { AuthenticatedSocket } from './types';
import { SOCKET_EVENTS } from '@utils/constants.util';
import { IGatewaySessionService } from './interfaces';
import { IAuthService } from '@modules/auth/interfaces';
import { SERVICES } from '@utils/constants.util';

@WebSocketGateway()
export class SocketGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server;

	private readonly logger = new Logger(WebSocketGateway.name);

	constructor(
		@Inject(SERVICES.AUTH_SERVICE)
		private readonly authService: IAuthService,
		@Inject(SERVICES.GATEWAY_SESSION_SERVICE)
		readonly sessionManager: IGatewaySessionService,
	) {}

	// handle after init io server
	afterInit(): void {
		this.logger.log('Websocket Gateway initialized.');
	}

	handleConnection(client: AuthenticatedSocket): void {
		const ioServer = this.server.of('/');

		this.logger.debug(
			`Socket connected with userID: ${client.user.id}, and email: "${client.user.email}"`,
		);
		this.logger.log(`WS Client with id: ${client.id} connected!`);
		this.logger.debug(`Number of connected sockets: ${ioServer.sockets.size}`);

		client.join(client.roomId);

		client.emit(SOCKET_EVENTS.ON_RECEIVE_NEW_CONNECTION, {
			userInfo: client.user,
			clientId: client.clientId,
		});
	}

	handleDisconnect(client: AuthenticatedSocket): void {
		const ioServer = this.server.of('/');

		client.leave(client.roomId);

		this.logger.log(`Disconnected socket id: ${client.id}`);
		this.logger.debug(`Number of connected sockets: ${ioServer.sockets.size}`);
	}

	@SubscribeMessage('events')
	findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
		console.log(data);
		return from([1, 2, 3]).pipe(
			map((item) => ({ event: 'events', data: item })),
		);
	}

	@SubscribeMessage('identity')
	async identity(@MessageBody() data: number): Promise<number> {
		return data;
	}

	// ----------------------------------Event listeners-------------------------------
}
