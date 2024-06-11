import { Conversation } from '@configs/typeorm';
import { ConversationAccessParams } from '../utils/types';
import { UserDto } from '@modules/user/dtos';
import { CreateConversationDto } from '../dtos/create-conversation.dto';

export interface IConversationService {
	createConversation(
		user: UserDto,
		conversationParams: CreateConversationDto,
	): Promise<Conversation>;
	getConversations(userId: string): Promise<Conversation[]>;
	findById(id: string): Promise<Conversation | null>;
	hasAccess(params: ConversationAccessParams): Promise<boolean>;
	getConversationContent(id: string): Promise<Conversation>;
}
