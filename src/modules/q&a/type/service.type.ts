import { Answer, Conversation, Prompt } from '@configs/typeorm';
import { UserDto } from '@modules/user/dtos';

export type CreatePromptParams = {
	id: string;
	content: string;
	attachment?: Express.Multer.File;
	user: UserDto;
};

export type CreatePromptResponse = {
	prompt: Prompt;
	conversation: Conversation;
};

export type CreateAnswerParams = {
	id: string;
	content: string;
};

export type CreateAnswerResponse = {
	answer: Answer;
	conversation: Conversation;
};
