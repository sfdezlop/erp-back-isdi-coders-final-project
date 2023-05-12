import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
dotenv.config();

export const config = {
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: encodeURIComponent(process.env.DB_PASSWORD as string),
  DB_CLUSTER: process.env.DB_CLUSTER,
  DB_NAME: process.env.DB_NAME,
  JWT_SECRET: process.env.JWT_SECRET,
};

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const stringSeparator = '_-_';
// Used to separate string in order to distinguish fields in certain parts of code. If your are going to use data in your data base with high probability of containing this string, change it to avoid malfunction on it. The stringSeparator need to be the same for backend and frontend to coordinate code of both apps.
