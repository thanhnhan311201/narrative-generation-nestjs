export enum SERVICES {
	AUTH_SERVICE = 'AUTH_SERVICE',
	USER_SERVICE = 'USER_SERVICE',
	GATEWAY_SESSION_SERVICE = 'GATEWAY_SESSION_SERVICE',
	GOOGLE_AUTH_SERVICE = 'GOOGLE_AUTH_SERVICE',
	REFRESH_TOKEN_SERVICE = 'REFRESH_TOKEN_SERVICE',
	GENERATIVE_AI_SERVICE = 'GENERATIVE_AI_SERVICE',
	AWS_S3_SERVICE = 'AWS_S3_SERVICE',
	CONVERSATION_SERVICE = 'CONVERSATION_SERVICE',
	Q_N_A_SERVICE = 'Q_N_A_SERVICE',
}

export enum ROUTES {
	AUTH = 'auth',
	USER = 'user',
	CONVERSATION = 'conversation',
	Q_N_A = 'qa',
}

export enum SOCKET_EVENTS {
	// general
	NEW_CONNECTION = 'new_connection',
	SIGNOUT = 'signout',

	// conversation events
	CONVERSATION_CREATE = 'conversation:create',
}

export enum SERVER_EVENTS {
	// conversation events
	CONVERSATION_CREATE = 'conversation:create',
}

export const SOCKET_CLIENT_ID_HEADER = 'socket-clientid';
