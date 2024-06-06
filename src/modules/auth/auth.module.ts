import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

import { UserModule } from '@modules/user/user.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy, JwtRefreshStrategy } from './strategies';
import { RefreshTokenService } from './services/refresh-token.service';
import { GoogleAuthService } from './services/google-auth.service';

import { SERVICES } from '@utils/constants.util';

@Module({
	imports: [UserModule, PassportModule, JwtModule, HttpModule],
	controllers: [AuthController],
	providers: [
		{
			provide: SERVICES.AUTH_SERVICE,
			useClass: AuthService,
		},
		JwtStrategy,
		JwtRefreshStrategy,
		{
			provide: SERVICES.REFRESH_TOKEN_SERVICE,
			useClass: RefreshTokenService,
		},
		{
			provide: SERVICES.GOOGLE_AUTH_SERVICE,
			useClass: GoogleAuthService,
		},
	],
	exports: [
		{
			provide: SERVICES.AUTH_SERVICE,
			useClass: AuthService,
		},
	],
})
export class AuthModule {}
