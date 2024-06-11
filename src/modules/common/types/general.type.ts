import { Request } from 'express';

import { User } from '@configs/typeorm';

export enum PROVIDER {
	GOOGLE = 'google',
	GITHUB = 'github',
	FACEBOOK = 'facebook',
}

export enum STATUS {
	SUCCESS = 'success',
	ERROR = 'error',
}

export enum PROMPT_TYPE {
	IMAGE = 'image',
	AUDIO = 'audio',
	TEXT = 'text',
	VIDEO = 'video',
}

export interface AuthenticatedRequest extends Request {
	user: User;
}
