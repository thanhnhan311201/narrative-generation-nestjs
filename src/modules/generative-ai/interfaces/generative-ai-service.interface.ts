import { Prompt } from '@configs/typeorm';

export interface IGenerativeAIService {
	generateAnswer(conversationId: string, prompt: Prompt): Promise<string>;
}
