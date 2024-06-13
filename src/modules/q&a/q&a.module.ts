import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Answer, Prompt } from '@configs/typeorm';
import { QnAController } from './q&a.controller';
import { QnAService } from './q&a.service';
import { CloudStorageModule } from '@modules/cloud-storage/cloud-storage.module';

import { SERVICES } from '@utils/constants.util';
import { ConversationModule } from '@modules/conversation/conversation.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Answer, Prompt]),
		CloudStorageModule,
		ConversationModule,
	],
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
