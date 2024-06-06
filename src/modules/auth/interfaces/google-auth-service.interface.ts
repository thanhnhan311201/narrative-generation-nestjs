import { TokenPayload } from 'google-auth-library';

export interface IGoogleAuthService {
	verifyAuthToken(auth: string): Promise<TokenPayload>;
}
