import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Conversation } from './conversation.entity';

@Entity()
export class Prompt extends BaseEntity {
	@Column()
	content: string;

	@ManyToOne(() => Conversation, (conversation) => conversation.prompts)
	conversation: Conversation;

	@Column({
		default: null,
	})
	attachment: string | null;
}
