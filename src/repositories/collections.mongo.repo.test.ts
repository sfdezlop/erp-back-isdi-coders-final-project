import { CollectionsMongoRepo } from './collections.mongo.repo.js';
// Import { ProductModel } from './products.mongo.model';

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
