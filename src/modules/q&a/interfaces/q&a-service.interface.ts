import {
	CreateAnswerParams,
	CreateAnswerResponse,
	CreatePromptParams,
	CreatePromptResponse,
} from '../type/service.type';

export interface IQnAService {
	createPrompt(params: CreatePromptParams): Promise<CreatePromptResponse>;
	createAnswer(params: CreateAnswerParams): Promise<CreateAnswerResponse>;
}
