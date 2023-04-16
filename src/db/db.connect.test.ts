import mongoose from 'mongoose';
import { dbConnect } from './db.connect';

describe('Given a dbConnect to mongo atlas function', () => {
  describe('When it is invoked', () => {
    test('Then should connect with the production database', async () => {
      const result = await dbConnect();
      expect(result).toBe(mongoose);
      expect(mongoose.connection.db.databaseName).toContain('ERP');
      mongoose.disconnect();
    });
  });
  describe('When it is invoked', () => {
    test('Then should connect with the production database', async () => {
      const result = await dbConnect('env');
      expect(result).toBe(mongoose);
      expect(mongoose.connection.db.databaseName).toContain('ERP');
      mongoose.disconnect();
    });
  });
  describe('When it is invoked with in testing mode', () => {
    test('Then should connect with a _Testing database', async () => {
      const result = await dbConnect(process.env.NODE_ENV);
      expect(result).toBe(mongoose);
      expect(mongoose.connection.db.databaseName).toContain('_Testing');
      mongoose.disconnect();
    });
  });
});
