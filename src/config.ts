// Import path from 'path';
// Import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
dotenv.config();

export const config = {
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: encodeURIComponent(process.env.DB_PASSWORD as string),
  DB_CLUSTER: process.env.DB_CLUSTER,
  DB_NAME: process.env.DB_NAME,
  JWT_SECRET: process.env.JWT_SECRET,
};

// Export const __dirname = path.dirname(fileURLToPath(import.meta.url));
