import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
	S3Client,
	DeleteObjectCommand,
	GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Progress, Upload } from '@aws-sdk/lib-storage';

import { ICloudStorageService } from './interfaces';
import { IConfig, IThirdPartyConfig } from '@configs/env';
import { Readable } from 'stream';

@Injectable({})
export class AwsS3Service implements ICloudStorageService {
	private readonly s3Client: S3Client;

	constructor(private readonly cfgService: ConfigService<IConfig>) {
		this.s3Client = new S3Client({
			region: cfgService.get<IThirdPartyConfig>('thirdParty').awsS3.region,
			credentials: {
				accessKeyId:
					cfgService.get<IThirdPartyConfig>('thirdParty').awsS3.accessKeyId,
				secretAccessKey:
					cfgService.get<IThirdPartyConfig>('thirdParty').awsS3.secretAccessKey,
			},
		});
	}

	async uploadFileToBucket(
		file: Express.Multer.File,
	): Promise<{ fileUrl: string; key: string }> {
		try {
			const bucketName =
				this.cfgService.get<IThirdPartyConfig>('thirdParty').awsS3.bucketName;
			const key = `${Date.now().toString()}-${file.originalname}`;

			const parallelS3Upload = new Upload({
				client: this.s3Client,
				params: {
					Bucket: bucketName,
					Key: key,
					Body: Buffer.from(file.buffer),
					ACL: 'public-read',
					ContentType: file.mimetype,
				},
				queueSize: 4, // optional concurrency configuration
				partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
				leavePartsOnError: false, // optional manually handle dropped parts
			});

			parallelS3Upload.on('httpUploadProgress', (progress: Progress) => {
				console.log(progress);
			});

			await parallelS3Upload.done();

			return {
				fileUrl: `https://${bucketName}.s3.amazonaws.com/${key}`,
				key: key,
			};
		} catch (error) {
			console.log(error.message);
			throw new BadRequestException(error.message);
		}
	}

	async deleteFileFromBucket(key: string): Promise<boolean> {
		try {
			const bucketName =
				this.cfgService.get<IThirdPartyConfig>('thirdParty').awsS3.bucketName;
			await this.s3Client.send(
				new DeleteObjectCommand({
					Bucket: bucketName,
					Key: key,
				}),
			);

			return true;
		} catch (error) {
			throw new BadRequestException();
		}
	}

	async getFileFromBucket(
		key: string,
	): Promise<{ fileBuffer: Buffer; contentType: string }> {
		try {
			const bucketName =
				this.cfgService.get<IThirdPartyConfig>('thirdParty').awsS3.bucketName;
			const obj = await this.s3Client.send(
				new GetObjectCommand({
					Bucket: bucketName,
					Key: key,
				}),
			);

			const chunks: Buffer[] = [];
			for await (const chunk of obj.Body as Readable) {
				chunks.push(chunk);
			}
			const fileBuffer = Buffer.concat(chunks);

			return { fileBuffer, contentType: obj.ContentType };
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}
}
