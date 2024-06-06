import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IQnAService } from './interfaces';

import { IConfig } from '@configs/env';

@Injectable({})
export class QnAService implements IQnAService {
	constructor(private readonly cfgService: ConfigService<IConfig>) {}
}
