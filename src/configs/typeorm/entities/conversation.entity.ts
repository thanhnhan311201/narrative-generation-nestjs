import { Entity, OneToOne, JoinColumn, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Prompt } from './prompt.entity';
import { Answer } from './answer.entity';
import { User } from './user.entity';

@Entity()
export class Conversation extends BaseEntity {
	@OneToOne(() => User, (user) => user.conversations)
	@JoinColumn()
	creator: User;

	@OneToMany(() => Prompt, (prompt) => prompt.conversation, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	prompts: Prompt[];

	@OneToMany(() => Answer, (answer) => answer.conversation, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	answers: Answer[];
}
