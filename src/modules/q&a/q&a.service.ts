import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IQnAService } from './interfaces';

import { IConfig } from '@configs/env';
import {
	CreateAnswerParams,
	CreateAnswerResponse,
	CreatePromptParams,
	CreatePromptResponse,
} from './type/service.type';
import { SERVICES } from '@utils/constants.util';
import { ICloudStorageService } from '@modules/cloud-storage/interfaces';
import { IConversationService } from '@modules/conversation/interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer, Prompt } from '@configs/typeorm';
import { Repository } from 'typeorm';

@Injectable({})
export class QnAService implements IQnAService {
	constructor(
		@InjectRepository(Prompt)
		private readonly promptRepo: Repository<Prompt>,
		@InjectRepository(Answer)
		private readonly answerRepo: Repository<Answer>,
		@Inject(SERVICES.AWS_S3_SERVICE)
		private readonly s3Service: ICloudStorageService,
		@Inject(SERVICES.CONVERSATION_SERVICE)
		private readonly conversationService: IConversationService,
		private readonly cfgService: ConfigService<IConfig>,
	) {}

	async createPrompt(
		params: CreatePromptParams,
	): Promise<CreatePromptResponse> {
		const { user, content, id } = params;

		const conversation = await this.conversationService.findById(id);
		if (!conversation)
			throw new NotFoundException('Conversation was not found');

		const { creator } = conversation;
		if (creator.id !== user.id)
			throw new BadRequestException('Can not create prompt');

		const uploadedAttachment = params.attachment
			? await this.s3Service.uploadFileToBucket(params.attachment)
			: null;
		const prompt = this.promptRepo.create({
			content,
			conversation,
			attachment: uploadedAttachment ? uploadedAttachment.key : null,
		});
		const savedPrompt = await this.promptRepo.save(prompt);
		const updated = await this.conversationService.save(conversation);

		return { prompt: savedPrompt, conversation: updated };
	}

	async createAnswer(
		params: CreateAnswerParams,
	): Promise<CreateAnswerResponse> {
		const { content, id } = params;

		const conversation = await this.conversationService.findById(id);
		if (!conversation)
			throw new NotFoundException('Conversation was not found');

		const answer = this.answerRepo.create({
			content,
			conversation,
		});
		const savedAnswer = await this.answerRepo.save(answer);
		const updated = await this.conversationService.save(conversation);

		return { answer: savedAnswer, conversation: updated };
	}
}
