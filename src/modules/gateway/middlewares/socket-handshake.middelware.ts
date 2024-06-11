import { ForbiddenException, Logger } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { IGatewaySessionService } from '../interfaces';

import { IAuthService } from '@modules/auth/interfaces';
import { AuthenticatedSocket } from '../types/auth.type';

export const handshakeAuthMiddleware =
	(
		authService: IAuthService,
		logger: Logger,
		gatewaySessionManager: IGatewaySessionService,
	) =>
	async (socket: AuthenticatedSocket, next) => {
		const token =
			socket.handshake.auth.token || socket.handshake.headers['token'];
		logger.debug(`Validating auth token before connection: ${token}`);

		if (!token) {
			return next(new ForbiddenException());
		}

		try {
			const user = await authService.verifyAccessToken(token);

			const clientId: string = uuidv4();

			socket.user = {
				id: user.id,
				email: user.email,
				username: user.username,
				profilePhoto: user.profilePhoto,
			};
			socket.clientId = clientId;
			socket.roomId = user.id;

			gatewaySessionManager.setUserSocket(socket.clientId, socket);

			next();
		} catch {
			next(new ForbiddenException());
		}
	};
