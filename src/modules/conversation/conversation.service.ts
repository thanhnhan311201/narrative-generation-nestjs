import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IConversationService } from './interfaces';

import { IConfig } from '@configs/env';

@Injectable({})
export class ConversationService implements IConversationService {
	constructor(private readonly cfgService: ConfigService<IConfig>) {}
}
