import 'dotenv/config';

import { DataSource } from 'typeorm';

import { dbConfig } from '@/configs';

export const dataSource = new DataSource(dbConfig);
