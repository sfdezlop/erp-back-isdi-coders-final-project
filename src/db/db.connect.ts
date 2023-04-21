import mongoose from 'mongoose';
import { config } from '../config.js';
import createDebug from 'debug';

const debug = createDebug('');

const { DB_USER, DB_PASSWORD, DB_CLUSTER, DB_NAME } = config;

export const dbConnect = (env?: string) => {
  const finalEnv = env || process.env.NODE_ENV;
  const finalDBName = finalEnv === 'test' ? DB_NAME + '_Testing' : DB_NAME;
  const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}/${finalDBName}?retryWrites=true&w=majority`;
  debug('ERP:uri');
  return mongoose.connect(uri);
};
