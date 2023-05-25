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

// Eliminated because testing does not work:
// export const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const stringSeparator = '_-_';
// Used to separate string in order to distinguish fields in certain parts of code.
// To assure a coordinated work between backend and frontend, const `stringSeparator` must have the strict equal initialization in both apps (e.g. '_-_'). const `stringSeparator` are defined at /src/config.ts files of the backend and frontend. Please note that if your are going to use data in your data base with high probability of containing this string, change it to another one more complex to avoid malfunction on it.
