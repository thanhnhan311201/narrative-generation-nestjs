import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

import { IGenerativeAIService } from './interfaces';
import { IConfig, IThirdPartyConfig } from '@configs/env';

@Injectable({})
export class Gemini15ProService implements IGenerativeAIService {
	private readonly model: GenerativeModel;

	constructor(private readonly cfgService: ConfigService<IConfig>) {
		const genAI = new GoogleGenerativeAI(
			cfgService.get<IThirdPartyConfig>('thirdParty').googleAI.apiKey,
		);
		this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
	}

	async genStory(prompt: string): Promise<string> {
		try {
			const result = await this.model.generateContent(prompt);
			const response = result.response;
			const text = response.text();
			return text;
		} catch (error) {
			throw new BadRequestException();
		}
	}
}
