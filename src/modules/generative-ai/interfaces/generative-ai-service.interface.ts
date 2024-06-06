export interface IGenerativeAIService {
	genStory(prompt: string): Promise<string>;
}
