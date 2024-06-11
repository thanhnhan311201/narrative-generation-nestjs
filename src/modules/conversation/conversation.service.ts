import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IConversationService } from './interfaces';

import { IConfig } from '@configs/env';
import { Conversation, User } from '@configs/typeorm';
import { ConversationAccessParams } from './utils/types';
import { CreateConversationDto } from './dtos/create-conversation.dto';

@Injectable({})
export class ConversationService implements IConversationService {
	constructor(
		@InjectRepository(Conversation)
		private readonly conversationRepo: Repository<Conversation>,
		private readonly cfgService: ConfigService<IConfig>,
	) {}

	async getConversations(userId: string): Promise<Conversation[]> {
		return this.conversationRepo.find({
			relations: ['creator'],
			where: { creator: { id: userId } },
			order: {
				updatedAt: 'DESC',
			},
		});
	}

	async findById(id: string): Promise<Conversation | null> {
		return this.conversationRepo.findOne({
			where: { id },
			relations: ['creator'],
		});
	}

	async createConversation(
		user: User,
		{ title }: CreateConversationDto,
	): Promise<Conversation> {
		const conversation = this.conversationRepo.create({
			title: title,
			creator: user,
		});
		const savedConversation = await this.conversationRepo.save(conversation);

		return savedConversation;
	}

	async hasAccess({ id, userId }: ConversationAccessParams): Promise<boolean> {
		const conversation = await this.findById(id);
		if (!conversation)
			throw new NotFoundException('Conversation was not found');

		return conversation.creator.id === userId;
	}

	getConversationContent(id: string): Promise<Conversation> {
		return this.conversationRepo.findOne({
			where: { id },
			relations: ['prompts', 'answers'],
			order: {
				prompts: {
					updatedAt: 'DESC',
				},
				answers: {
					updatedAt: 'DESC',
				},
			},
		});
	}
}
