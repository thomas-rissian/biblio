import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import PrismaClientModule from '@prisma/client'
import fs from 'fs';
import path from 'path';

const { PrismaClient, Prisma } = PrismaClientModule

// Read password from secret file if available, otherwise use env var
let password = process.env.DB_PASSWORD || '';
if (process.env.DB_PASSWORD_FILE && fs.existsSync(process.env.DB_PASSWORD_FILE)) {
  password = fs.readFileSync(process.env.DB_PASSWORD_FILE, 'utf-8').trim();
}

const connectionString = `postgresql://${process.env.DB_USER || 'postgres'}:${password}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'biblio'}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma, Prisma }
