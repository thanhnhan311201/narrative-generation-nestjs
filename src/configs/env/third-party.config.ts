export interface IThirdPartyConfig {
	google: {
		clientId: string;
		clientSecret: string;
		redirectUri: string;
		refreshToken: string;
	};
	googleAI: {
		apiKey: string;
	};
	awsS3: {
		bucketName: string;
		region: string;
		accessKeyId: string;
		secretAccessKey: string;
	};
}

export const thirdPartyConfig = () => ({
	thirdParty: {
		google: {
			clientId: process.env.GOOGLE_CREDENTIAL_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CREDENTIAL_CLIENT_SECRET,
			redirectUri: process.env.GOOGLE_REDIRECT_URI,
			refreshToken: process.env.GOOGLE_CREDENTIAL_REFRESH_TOKEN,
		},
		googleAI: {
			apiKey: process.env.GOOGLE_AI_API_KEY,
		},
		awsS3: {
			bucketName: process.env.AWS_S3_BUCKET_NAME,
			region: process.env.AWS_S3_REGION,
			accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
		},
	},
});
