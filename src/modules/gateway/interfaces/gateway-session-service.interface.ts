import { AuthenticatedSocket } from '../types/auth.type';

export interface IGatewaySessionService {
	getUserSocket(id: string): AuthenticatedSocket;
	setUserSocket(id: string, socket: AuthenticatedSocket): void;
	removeUserSocket(id: string): void;
	getAllSocketId(): IterableIterator<string>;
	getSockets(): Map<string, AuthenticatedSocket>;
}
