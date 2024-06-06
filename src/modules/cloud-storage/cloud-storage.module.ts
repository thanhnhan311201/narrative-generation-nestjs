import { Module } from '@nestjs/common';

import { AwsS3Service } from './aws-s3.service';

import { SERVICES } from '@utils/constants.util';

@Module({
	imports: [],
	controllers: [],
	providers: [
		{
			provide: SERVICES.AWS_S3_SERVICE,
			useClass: AwsS3Service,
		},
	],
	exports: [
		{
			provide: SERVICES.AWS_S3_SERVICE,
			useClass: AwsS3Service,
		},
	],
})
export class CloudStorageModule {}
