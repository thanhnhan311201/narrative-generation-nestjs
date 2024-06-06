import {
	BadRequestException,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { hashSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto, SigninDto } from '../dtos';
import { UserDto } from '@modules/user/dtos';

import { JwtPayload, Tokens } from '../types';
import { IConfig, IAuthenticationConfig } from '@configs/env';
import { PROVIDER } from '@modules/common/types';
import {
	IAuthService,
	IGoogleAuthService,
	IRefreshTokenService,
} from '../interfaces';
import { genRandomString } from 'src/utils/helpers.util';
import { IUserService } from '@modules/user/interfaces';
import { SERVICES } from '@utils/constants.util';

@Injectable({})
export class AuthService implements IAuthService {
	constructor(
		@Inject(SERVICES.USER_SERVICE)
		private readonly userService: IUserService,
		private readonly jwtService: JwtService,
		private readonly cfgService: ConfigService<IConfig>,
		@Inject(SERVICES.REFRESH_TOKEN_SERVICE)
		private readonly refreshTokenService: IRefreshTokenService,
		@Inject(SERVICES.GOOGLE_AUTH_SERVICE)
		private readonly googleAuthService: IGoogleAuthService,
		private readonly httpService: HttpService,
	) {}

	async genToken(userId: string, email: string): Promise<Tokens> {
		const jwtPayload = { sub: userId, email: email };

		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(jwtPayload, {
				secret: this.cfgService.get<IAuthenticationConfig>('auth').secretJwtKey,
				expiresIn:
					this.cfgService.get<IAuthenticationConfig>('auth').accessTokenExpTime,
			}),
			this.jwtService.signAsync(jwtPayload, {
				secret:
					this.cfgService.get<IAuthenticationConfig>('auth')
						.secretJwtRefreshKey,
				expiresIn:
					this.cfgService.get<IAuthenticationConfig>('auth')
						.refreshTokenExpTime,
			}),
		]);

		return {
			accessToken,
			refreshToken,
		};
	}

	async signup(payload: CreateUserDto): Promise<UserDto> {
		const users = await this.userService.find(payload.email);
		if (users.length) {
			throw new BadRequestException('Email already exists.');
		}

		// compare password and confirm password
		if (payload.password !== payload.confirmPassword) {
			throw new BadRequestException('Confirm password has to match.');
		}

		// Hash the user password
		const hash = hashSync(payload.password, 12);

		// Create a new user and save it
		const user = await this.userService.create({
			email: payload.email,
			password: hash,
			username: payload.username,
		});

		return user;
	}

	async signin(payload: SigninDto): Promise<Tokens> {
		const user = await this.userService.authenticateUser(
			payload.email,
			payload.password,
		);

		if (!user) {
			throw new UnauthorizedException('Invalid email or password.');
		}

		const { accessToken, refreshToken } = await this.genToken(
			user.id,
			user.email,
		);

		await this.refreshTokenService.insert(user.id, refreshToken);

		return {
			accessToken,
			refreshToken,
		};
	}

	signout(userId: string): Promise<void> {
		return this.refreshTokenService.invalidate(userId);
	}

	async refreshAccessToken(refreshToken: string): Promise<Tokens> {
		try {
			const decoded = await this.jwtService.verifyAsync<JwtPayload>(
				refreshToken,
				{
					secret:
						this.cfgService.get<IAuthenticationConfig>('auth').secretJwtKey,
				},
			);

			const user = await this.userService.findOne(decoded.sub);
			if (!user) throw new UnauthorizedException('Invalid refresh token.');

			await this.refreshTokenService.validate(decoded.sub, refreshToken);

			const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
				await this.genToken(user.id, user.email);

			await this.refreshTokenService.insert(user.id, newRefreshToken);

			return {
				accessToken: newAccessToken,
				refreshToken: newRefreshToken,
			};
		} catch (error) {
			throw new UnauthorizedException('Invalid refresh token.');
		}
	}

	async googleLogin(authCode: string): Promise<Tokens> {
		const payload = await this.googleAuthService.verifyAuthToken(authCode);

		let tokens: Tokens;

		const users = await this.userService.find(payload.email);
		if (users.length) {
			const updatedUser = await this.userService.update(users[0].id, {
				email: payload.email,
				username: payload.name,
				profilePhoto: payload.picture,
				provider: PROVIDER.GOOGLE,
			});

			tokens = await this.genToken(updatedUser.id, updatedUser.email);

			await this.refreshTokenService.insert(
				updatedUser.id,
				tokens.refreshToken,
			);
		} else {
			// Hash the user password
			const hash = hashSync(genRandomString(8), 12);

			// Create a new user and save it
			const newUser = await this.userService.create({
				email: payload.email,
				password: hash,
				username: payload.name,
				provider: PROVIDER.GOOGLE,
				profilePhoto: payload.picture,
			});

			tokens = await this.genToken(newUser.id, newUser.email);

			await this.refreshTokenService.insert(newUser.id, tokens.refreshToken);
		}

		return { ...tokens };
	}

	async verifyAccessToken(token: string): Promise<UserDto> {
		try {
			const decoded = await this.jwtService.verifyAsync<JwtPayload>(token, {
				secret: this.cfgService.get<IAuthenticationConfig>('auth').secretJwtKey,
			});

			const user = await this.userService.findOne(decoded.sub);
			if (!user) throw new UnauthorizedException('Invalid access token.');

			return user;
		} catch (error) {
			throw new UnauthorizedException('Invalid access token.');
		}
	}
}
