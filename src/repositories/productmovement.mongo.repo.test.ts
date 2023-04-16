import { ProductMovementMongoRepo } from './productmovements.mongo.repo.js';
import { ProductMovementModel } from './productmovements.mongo.model';
import mongoose from 'mongoose';

jest.mock('./productmovements.mongo.model.js');

describe('Given a new ProductMovementMongoRepo created with a public static function (to follow singleton patron)', () => {
  const instanceOfProductMovementsMongoRepo =
    ProductMovementMongoRepo.getInstance();
  describe('When we call this function ', () => {
    test('Then Products Mongo Repo should be instanciated', () => {
      expect(instanceOfProductMovementsMongoRepo).toBeInstanceOf(
        ProductMovementMongoRepo
      );
    });
  });
  describe('When we use the query method', () => {
    test('Then it should return the mocked data', async () => {
      const mock = { id: '2' };
      (ProductMovementModel.find as jest.Mock).mockResolvedValue(mock);
      const result = await instanceOfProductMovementsMongoRepo.query();
      mongoose.disconnect();
      expect(ProductMovementModel.find).toHaveBeenCalled();
      expect(result).toBe(mock);
    });
  });

  describe('When the search method is used', () => {
    test('Then, it should return the searched mocked data', async () => {
      const mock = { id: '2' };
      (ProductMovementModel.find as jest.Mock).mockResolvedValue(mock);
      const result = await instanceOfProductMovementsMongoRepo.search({
        key: 'some',
        value: 'xd',
      });
      mongoose.disconnect();
      expect(ProductMovementModel.find).toHaveBeenCalled();
      expect(result).toEqual(mock);
    });
  });

  describe('When we use the destroy method to a record that does not exists ', () => {
    test('Then it should throw an error of Record not found (see error code assigned in user.mongo.repo.ts', async () => {
      (ProductMovementModel.findByIdAndDelete as jest.Mock).mockResolvedValue(
        undefined
      );
      const mockUserId = '1';
      mongoose.disconnect();
      expect(() =>
        instanceOfProductMovementsMongoRepo.destroy(mockUserId)
      ).rejects.toThrow();
      expect(ProductMovementModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });

  describe('When we use the destroy method to a record that exists', () => {
    test('Then it should delete the record', async () => {
      (ProductMovementModel.findByIdAndDelete as jest.Mock).mockResolvedValue(
        {}
      );
      const mockUserId = '2';
      const result = await instanceOfProductMovementsMongoRepo.destroy(
        mockUserId
      );
      mongoose.disconnect();
      expect(ProductMovementModel.findByIdAndDelete).toHaveBeenCalled();
      expect(result).toEqual(undefined);
    });
  });

  describe('When we use the countRecords method', () => {
    test('Then it should return the mocked number of records', async () => {
      // (UserModel.countDocuments() as unknown as jest.Mock).mockResolvedValue(1);
      await instanceOfProductMovementsMongoRepo.countRecords();
      expect(ProductMovementModel.countDocuments).toHaveBeenCalled();
      mongoose.disconnect();
    });
  });
});
