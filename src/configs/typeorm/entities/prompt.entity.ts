import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Conversation } from './conversation.entity';

import { PROMPT_TYPE } from '@modules/common/types';

@Entity()
export class Prompt extends BaseEntity {
	@Column()
	content: string;

	@ManyToOne(() => Conversation, (conversation) => conversation.prompts)
	conversation: Conversation;

	@Column({
		type: 'enum',
		name: 'prompt_type',
		enum: PROMPT_TYPE,
	})
	promptType: PROMPT_TYPE;
}
