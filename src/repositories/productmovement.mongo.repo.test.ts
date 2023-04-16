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
    test('Then the mongoose method find is called an it should return the mocked data', async () => {
      const mock = { id: '2' };
      (ProductMovementModel.find as jest.Mock).mockResolvedValue(mock);
      const result = await instanceOfProductMovementsMongoRepo.query();
      mongoose.disconnect();
      expect(ProductMovementModel.find).toHaveBeenCalled();
      expect(result).toBe(mock);
    });
  });

  describe('When the search method is used', () => {
    test('Then the mongoose method find is called and it should return the searched mocked data', async () => {
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
    test('Then the mongoose method findByIdAndDelete is called an it should throw an error of Record not found', async () => {
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

      expect(ProductMovementModel.findByIdAndDelete).toHaveBeenCalled();
      expect(result).toEqual(undefined);
      mongoose.disconnect();
    });
  });

  describe('When we use the countRecords method', () => {
    test('Then the mongoose method contDocuments is called', async () => {
      // (UserModel.countDocuments() as unknown as jest.Mock).mockResolvedValue(1);
      await instanceOfProductMovementsMongoRepo.countRecords();
      expect(ProductMovementModel.countDocuments).toHaveBeenCalled();
      mongoose.disconnect();
    });
  });

  describe('When we use the analytics method', () => {
    test('Then the mongoose aggregate method is called', async () => {
      await instanceOfProductMovementsMongoRepo.analytics();
      expect(ProductMovementModel.aggregate).toHaveBeenCalled();
      mongoose.disconnect();
    });
  });

  describe('When we use the queryId method', () => {
    test('Then the mongoose findById method is called', async () => {
      const mockProductMovementId = '1';
      (ProductMovementModel.findById as jest.Mock).mockResolvedValue(1);
      await instanceOfProductMovementsMongoRepo.queryId(mockProductMovementId);
      expect(ProductMovementModel.findById).toHaveBeenCalled();
      mongoose.disconnect();
    });
  });
});

// Pending tests with mongoose complex methods

// Describe('When we use the countFilteredRecords method', () => {
//   test('Then the mongoose find method is called', async () => {
//     const mockedQuery = {
//       filterField: 'filterField',
//       filterValue: 'filterValue',
//     };
//     (
//       ProductMovementModel.find(
//         mockedQuery
//       ).countDocuments() as unknown as jest.Mock
//     ).mockResolvedValue(1);
//     await instanceOfProductMovementsMongoRepo.countFilteredRecords;
//     expect(ProductMovementModel.find().countDocuments).toHaveBeenCalled();
//     mongoose.disconnect();
//   });
// });

// Describe('When we use the getByFilterWithPaginationAndOrder method', () => {
//   test('Then the mongoose find method is called', async () => {
//     const mockedFilter = {
//       filterField: 'filterField',
//       filterValue: 'filterValue',
//       filterSet: 1,
//       filterRecordsPerSet: 1,
//       orderField: 'orderField',
//     };
//     await instanceOfProductMovementsMongoRepo.getByFilterWithPaginationAndOrder(
//       mockedFilter
//     );
//     expect(ProductMovementModel.find).toHaveBeenCalled();
//     mongoose.disconnect();
//   });
// });
