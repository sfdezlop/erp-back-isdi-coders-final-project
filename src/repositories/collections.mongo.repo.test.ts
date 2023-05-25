import { CollectionsMongoRepo } from './collections.mongo.repo.js';
import mongoose, { Model } from 'mongoose';
// Import { ProductModel } from './products.mongo.model';

const mockExecFunction = (mockValue: unknown) => ({
  exec: jest.fn().mockResolvedValue(mockValue),
});

const ProductModel = {
  aggregate: jest.fn(),
};

describe('Given a new CollectionsMongoRepo created with a public static function (to follow singleton patron)', () => {
  const instanceOfCollectionsMongoRepo = CollectionsMongoRepo.getInstance();
  describe('When we call this function ', () => {
    test('Then Collections Mongo Repo should be instanciated', () => {
      expect(instanceOfCollectionsMongoRepo).toBeInstanceOf(
        CollectionsMongoRepo
      );
    });
  });
});
