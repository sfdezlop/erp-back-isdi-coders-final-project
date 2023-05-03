import { ReqRespMongoRepo } from './reqresp.mongo.repo.js';
import { ReqRespModel } from './reqresp.mongo.model';
import mongoose from 'mongoose';

jest.mock('./reqresp.mongo.model.js');

describe('Given a new ReqRespMongoRepo created with a public static function (to follow singleton patron)', () => {
  const instanceOfReqRespMongoRepo = ReqRespMongoRepo.getInstance();
  describe('When we call this function ', () => {
    test('Then ReqRespMongoRepo should be instanciated', () => {
      expect(instanceOfReqRespMongoRepo).toBeInstanceOf(ReqRespMongoRepo);
    });
  });
  describe('When we use the query method', () => {
    test('Then it should return the mocked data', async () => {
      const mock = { id: '2' };
      (ReqRespModel.find as jest.Mock).mockResolvedValue(mock);
      const result = await instanceOfReqRespMongoRepo.query();
      mongoose.disconnect();
      expect(ReqRespModel.find).toHaveBeenCalled();
      expect(result).toBe(mock);
    });
  });

  // Describe('When we use the create method', () => {
  //   test('Then it should return the new mocked data', async () => {
  //     const mock = { id: '2' };
  //     (ReqRespModel.create as jest.Mock).mockResolvedValue(mock);
  //     const result = await instanceOfReqRespMongoRepo.create(mock);
  //     expect(ReqRespModel.create).toHaveBeenCalled();
  //     expect(result.id).toBe('2');
  //     mongoose.disconnect();
  //   });
  // });
});
