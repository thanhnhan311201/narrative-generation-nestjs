import { GetObjectCommandOutput } from '@aws-sdk/client-s3';

export interface ICloudStorageService {
	uploadFileToBucket(
		file: Express.Multer.File,
	): Promise<{ fileUrl: string; key: string }>;
	deleteFileFromBucket(key: string): Promise<boolean>;
	getFileFromBucket(key: string): Promise<GetObjectCommandOutput>;
}
