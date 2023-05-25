import { CollectionsMongoRepo } from './collections.mongo.repo.js';
import mongoose, { Model } from 'mongoose';

const mockExecFunction = (mockValue: unknown) => ({
  exec: jest.fn().mockResolvedValue(mockValue),
});

let CollectionModel: typeof Model;

describe('Given a new CollectionsMongoRepo created with a public static function (to follow singleton patron)', () => {
  const instanceOfCollectionsMongoRepo = CollectionsMongoRepo.getInstance();
  describe('When we call this function ', () => {
    test('Then Products Mongo Repo should be instanciated', () => {
      expect(instanceOfCollectionsMongoRepo).toBeInstanceOf(
        CollectionsMongoRepo
      );
    });
  });
  describe('When we call the calculate method', () => {
    test('Then the mongoose aggregate method is called an it should return the mocked record', async () => {
      const mockResult = { id: '10' };
      (CollectionModel.aggregate as jest.Mock).mockImplementation(() =>
        mockExecFunction(mockResult)
      );
      const result = await instanceOfCollectionsMongoRepo.calculate('mock');
      await mongoose.disconnect();
      expect(CollectionModel.aggregate).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });
});
