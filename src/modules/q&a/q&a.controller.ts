import { Controller, Inject } from '@nestjs/common';

import { IQnAService } from './interfaces';

import { SERVICES } from '@utils/constants.util';
import { ROUTES } from '@utils/constants.util';

@Controller(ROUTES.Q_N_A)
export class QnAController {
	constructor(
		@Inject(SERVICES.Q_N_A_SERVICE)
		private readonly qnAService: IQnAService,
	) {}
}
