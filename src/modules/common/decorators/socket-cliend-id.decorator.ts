import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SOCKET_CLIENT_ID_HEADER } from '@utils/constants.util';

export const SocketClientId = createParamDecorator(
	(data: any, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		const clientId = request.headers[SOCKET_CLIENT_ID_HEADER];
		if (clientId) {
			return clientId;
		}

		return null;
	},
);
