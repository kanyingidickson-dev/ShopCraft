import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = (process.env.DATABASE_URL || 'file:./dev.db') as string;
const dbFile = connectionString.replace('file:', '');

const adapter = new PrismaBetterSqlite3({ url: dbFile });
const prisma = new PrismaClient({ adapter });

export default prisma;
