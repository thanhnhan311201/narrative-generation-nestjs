import { Entity, Column, OneToMany, JoinColumn } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Conversation } from './conversation.entity';

import { PROVIDER } from '@modules/common/types';

@Entity()
export class User extends BaseEntity {
	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@Column()
	username: string;

	@Column({
		name: 'profile_photo',
	})
	profilePhoto: string;

	@OneToMany(() => Conversation, (conversation) => conversation.creator)
	@JoinColumn()
	conversations: Conversation[];

	@Column({
		type: 'enum',
		enum: PROVIDER,
	})
	provider: PROVIDER;
}
