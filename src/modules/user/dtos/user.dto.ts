import { Expose } from 'class-transformer';

import { PROVIDER } from '@modules/common/types';
import { BaseDto } from '@modules/common/dtos/base..dto';

export class UserDto extends BaseDto {
	@Expose()
	id: string;

	@Expose()
	email: string;

	@Expose()
	username: string;

	@Expose()
	profilePhoto: string;

	@Expose()
	provider: PROVIDER;
}
