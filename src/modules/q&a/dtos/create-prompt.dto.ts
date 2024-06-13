import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePromptDto {
	@IsNotEmpty()
	@IsString()
	content: string;
}
