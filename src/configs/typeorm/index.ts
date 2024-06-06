import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

import { User } from './entities/user.entity';
import { Conversation } from './entities/conversation.entity';
import { Prompt } from './entities/prompt.entity';
import { Answer } from './entities/answer.entity';

dotenvConfig({
	path: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
});

export const entities = [User, Conversation, Prompt, Answer];
const ormConfig = {
	type: 'postgres',
	host: process.env.POSTGRES_HOST,
	port: parseInt(process.env.POSTGRES_PORT),
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	entities: entities,
	synchronize: true, // shouldn't use in production
};
const connectionSource = new DataSource(ormConfig as DataSourceOptions);

export { User, Conversation, Prompt, Answer };
export default connectionSource;
