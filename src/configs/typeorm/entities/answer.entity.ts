import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Conversation } from './conversation.entity';

@Entity()
export class Answer extends BaseEntity {
	@Column()
	content: string;

	@ManyToOne(() => Conversation, (conversation) => conversation.answers)
	conversation: Conversation;
}
