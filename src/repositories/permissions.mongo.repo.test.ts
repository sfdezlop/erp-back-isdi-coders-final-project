import { PermissionsMongoRepo } from './permissions.mongo.repo.js';
import { PermissionModel } from './permissions.mongo.model';
import mongoose from 'mongoose';

jest.mock('./permissions.mongo.model.js');

describe('Given a new PermissionsMongoRepo created with a public static function (to follow singleton patron)', () => {
  const instanceOfPermissionsMongoRepo = PermissionsMongoRepo.getInstance();
  describe('When we call this function ', () => {
    test('Then Permissions Mongo Repo should be instanciated', () => {
      expect(instanceOfPermissionsMongoRepo).toBeInstanceOf(
        PermissionsMongoRepo
      );
    });
  });

  describe('When we use the search method', () => {
    test('Then it should return the mocked data', async () => {
      const mock = { id: '2' };
      const query = {
        key: 'id',
        value: '2',
      };
      (PermissionModel.find as jest.Mock).mockResolvedValue(mock);
      const result = await instanceOfPermissionsMongoRepo.search(query);
      mongoose.disconnect();
      expect(PermissionModel.find).toHaveBeenCalled();
      expect(result).toBe(mock);
    });
  });
});
