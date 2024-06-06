import { Injectable } from '@nestjs/common';

import { IGatewaySessionService } from './interfaces';
import { AuthenticatedSocket } from './types/auth.type';

@Injectable({})
export class GatewaySessionService implements IGatewaySessionService {
	private readonly sessions: Map<string, AuthenticatedSocket> = new Map();

	getUserSocket(id: string): AuthenticatedSocket {
		return this.sessions.get(id);
	}

	setUserSocket(userId: string, socket: AuthenticatedSocket) {
		this.sessions.set(userId, socket);
	}

	removeUserSocket(userId: string) {
		this.sessions.delete(userId);
	}

	getAllSocketId(): IterableIterator<string> {
		return this.sessions.keys();
	}

	getSockets(): Map<string, AuthenticatedSocket> {
		return this.sessions;
	}
}
