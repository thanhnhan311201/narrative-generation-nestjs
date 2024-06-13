import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
	GoogleGenerativeAI,
	GenerativeModel,
	Content,
	Part,
} from '@google/generative-ai';

import { IGenerativeAIService } from './interfaces';
import { IConfig, IThirdPartyConfig } from '@configs/env';
import { SERVICES } from '@utils/constants.util';
import { ICloudStorageService } from '@modules/cloud-storage/interfaces';
import { IConversationService } from '@modules/conversation/interfaces';
import { Prompt } from '@configs/typeorm';

@Injectable({})
export class Gemini15ProService implements IGenerativeAIService {
	private readonly model: GenerativeModel;

	constructor(
		private readonly cfgService: ConfigService<IConfig>,
		@Inject(SERVICES.AWS_S3_SERVICE)
		private readonly s3Service: ICloudStorageService,
		@Inject(SERVICES.CONVERSATION_SERVICE)
		private readonly conversationService: IConversationService,
	) {
		const genAI = new GoogleGenerativeAI(
			cfgService.get<IThirdPartyConfig>('thirdParty').googleAI.apiKey,
		);
		this.model = genAI.getGenerativeModel({
			model: 'gemini-1.5-pro-latest',
		});
	}

	async generateAnswer(
		conversationId: string,
		prompt: Prompt,
	): Promise<string> {
		const conversationContent =
			await this.conversationService.getConversationContent(conversationId);
		if (!conversationContent)
			throw new NotFoundException('Conversation was not found');

		const entireConversation = [
			...conversationContent.prompts.slice(0, -1).map((prompt) => ({
				id: prompt.id,
				key: 'prompt',
				content: prompt.content,
				attachment: prompt.attachment,
				createAt: prompt.createAt,
			})),
			...conversationContent.answers.map((answer) => ({
				id: answer.id,
				key: 'answer',
				content: answer.content,
				attachment: null,
				createAt: answer.createAt,
			})),
		];
		entireConversation.sort((a, b) => {
			return new Date(a.createAt).getTime() - new Date(b.createAt).getTime();
		});

		const history: Content[] = [];
		for (const msg of entireConversation) {
			if (msg.key === 'answer') {
				history.push({
					role: 'model',
					parts: [{ text: msg.content }],
				});
			} else {
				if (msg.attachment) {
					const { fileBuffer, contentType } =
						await this.s3Service.getFileFromBucket(msg.attachment);

					history.push({
						role: 'user',
						parts: [
							{
								inlineData: {
									data: fileBuffer.toString('base64'),
									mimeType: contentType,
								},
							},
							{ text: msg.content },
						],
					});
				} else {
					history.push({
						role: 'user',
						parts: [{ text: msg.content }],
					});
				}
			}
		}

		const chat = this.model.startChat({
			history: history,
		});

		let msg: string | Part[];
		if (prompt.attachment) {
			const { fileBuffer, contentType } =
				await this.s3Service.getFileFromBucket(prompt.attachment);
			msg = [
				{
					inlineData: {
						data: fileBuffer.toString('base64'),
						mimeType: contentType,
					},
				},
				{ text: prompt.content },
			];
		} else {
			msg = prompt.content;
		}
		const result = await chat.sendMessage(msg);
		const response = await result.response;
		const text = response.text();

		return text;
	}
}
