export interface IRefreshTokenService {
	insert(userId: string, token: string): Promise<void>;
	validate(userId: string, token: string): Promise<boolean>;
	invalidate(userId: string): Promise<void>;
}
