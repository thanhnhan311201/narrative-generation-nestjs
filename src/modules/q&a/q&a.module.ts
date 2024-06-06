import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Answer, Prompt } from '@configs/typeorm';
import { QnAController } from './q&a.controller';
import { QnAService } from './q&a.service';

import { SERVICES } from '@utils/constants.util';

@Module({
	imports: [TypeOrmModule.forFeature([Answer, Prompt])],
	controllers: [QnAController],
	providers: [
		{
			provide: SERVICES.Q_N_A_SERVICE,
			useClass: QnAService,
		},
	],
	exports: [
		{
			provide: SERVICES.Q_N_A_SERVICE,
			useClass: QnAService,
		},
	],
})
export class QnAModule {}
