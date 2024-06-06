import { PROVIDER } from '@modules/common/types';

export type CreateUser = {
	email: string;
	password: string;
	username: string;
	profilePhoto?: string;
	provider?: PROVIDER;
};
