import { ProductMovementMongoRepo } from './productmovements.mongo.repo.js';
import { ProductMovementModel } from './productmovements.mongo.model';
import mongoose from 'mongoose';

jest.mock('./productmovements.mongo.model.js');

const mockExecFunction = (mockValue: unknown) => ({
  exec: jest.fn().mockResolvedValue(mockValue),
});

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
  describe('When we call the query method', () => {
    test('Then the mongoose find method is called an it should return the mocked record', async () => {
      const mockResult = { id: '10' };
      (ProductMovementModel.find as jest.Mock).mockImplementation(() =>
        mockExecFunction(mockResult)
      );
      const result = await instanceOfProductMovementsMongoRepo.query();
      mongoose.disconnect();
      expect(ProductMovementModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });
  describe('When we call the queryId method', () => {
    test('Then the mongoose findById method is called an it should return the mocked record', async () => {
      const mockResult = { id: '10' };
      (ProductMovementModel.findById as jest.Mock).mockImplementation(() =>
        mockExecFunction(mockResult)
      );
      const result = await instanceOfProductMovementsMongoRepo.queryId('10');
      mongoose.disconnect();
      expect(ProductMovementModel.findById).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });
  describe('When we call the search method', () => {
    test('Then the find mongoose method is called and it should return the searched mocked data', async () => {
      const mockResult = { id: '10' };
      (ProductMovementModel.find as jest.Mock).mockImplementation(() =>
        mockExecFunction(mockResult)
      );
      const result = await instanceOfProductMovementsMongoRepo.search({
        key: 'field',
        value: 'value',
      });
      mongoose.disconnect();
      expect(ProductMovementModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('When we call the create method', () => {
    test('Then the create mongoose method is called and it should return the created mocked record', async () => {
      const mockResult = { id: '10' };
      (ProductMovementModel.create as jest.Mock).mockResolvedValue(mockResult);
      const result = await instanceOfProductMovementsMongoRepo.create(
        mockResult
      );
      mongoose.disconnect();
      expect(ProductMovementModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });
  describe('When we call the destroy method for a record that does not exist', () => {
    test('Then the mongoose method findByIdAndDelete is called an it should throw an error of Record not found', async () => {
      (ProductMovementModel.findByIdAndDelete as jest.Mock).mockResolvedValue(
        undefined
      );
      // Even if the destroy method is using .exec() to transform the mongoose pseudopromise in a promise, the mocked method works
      const mockId = '1';
      mongoose.disconnect();

      expect(() =>
        instanceOfProductMovementsMongoRepo.destroy(mockId)
      ).rejects.toThrow();
      expect(ProductMovementModel.findByIdAndDelete).toHaveBeenCalled();

      // When the order of the expects are different, the test does not work
    });
  });

  describe('When we call the destroy method for a record that exists', () => {
    test('Then the mongoose method findByIdAndDelete is called and it should delete the record', async () => {
      const mockResult = { id: '10' };
      (ProductMovementModel.findByIdAndDelete as jest.Mock).mockImplementation(
        () => mockExecFunction(mockResult)
      );
      const mockId = '2';
      const result = await instanceOfProductMovementsMongoRepo.destroy(mockId);
      mongoose.disconnect();

      expect(result).toEqual(mockResult);
      expect(ProductMovementModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });

  describe('When we use the analytics method', () => {
    test('Then the mongoose aggregate method is called', async () => {
      (ProductMovementModel.aggregate as jest.Mock).mockImplementation(() =>
        mockExecFunction({})
      );
      await instanceOfProductMovementsMongoRepo.analytics();
      mongoose.disconnect();

      expect(ProductMovementModel.aggregate).toHaveBeenCalled();
    });
  });
  describe('When we call the countRecords method', () => {
    test('Then the mongoose countDocuments is called an it should return the mocked record', async () => {
      const mockResult = { id: '10' };
      (ProductMovementModel.countDocuments as jest.Mock).mockImplementation(
        () => mockExecFunction(mockResult)
      );
      const result = await instanceOfProductMovementsMongoRepo.countRecords();
      mongoose.disconnect();
      expect(ProductMovementModel.countDocuments).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('When we call the stockBySku method', () => {
    test('Then the mongoose aggregate is called an it should return the mocked record', async () => {
      const mockResult = 1;
      (ProductMovementModel.aggregate as jest.Mock).mockImplementation(() =>
        mockExecFunction(mockResult)
      );
      const result = await instanceOfProductMovementsMongoRepo.stockBySku('10');
      mongoose.disconnect();
      expect(ProductMovementModel.aggregate).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('When we call the stock method', () => {
    test('Then the mongoose aggregate is called an it should return the mocked record', async () => {
      const mockResult = { id: 1 };
      (ProductMovementModel.aggregate as jest.Mock).mockImplementation(() =>
        mockExecFunction(mockResult)
      );
      const result = await instanceOfProductMovementsMongoRepo.stock();
      mongoose.disconnect();
      expect(ProductMovementModel.aggregate).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });
});

// Pending test:

// describe('When we use the getByFilterWithPaginationAndOrder method', () => {
//   test('Then the mongoose find method is called', async () => {
//     const mockSkipFunction = (mockValue: number) => ({
//       skip: jest.fn().mockImplementation(() => ({
//         exec: jest.fn().mockResolvedValue(mockValue),
//       })),
//     });

//     const mockLimitFunction = (mockValue: number) => ({
//       limit: jest.fn().mockImplementation(() => ({
//         exec: jest.fn().mockResolvedValue(mockValue),
//       })),
//     });

//     const mockSortFunction = (mockValue: string) => ({
//       sort: jest.fn().mockImplementation(() => ({
//         exec: jest.fn().mockResolvedValue(mockValue),
//       })),
//     });
//     (ProductMovementModel.find as jest.Mock).mockImplementation(() =>
//       mockSkipFunction(1)
//     );

//     await instanceOfProductMovementsMongoRepo.getByFilterWithPaginationAndOrder(
//       {
//         filterField: 'field',
//         filterValue: 'value',
//         filterSet: 1,
//         filterRecordsPerSet: 1,
//         orderField: 'field',
//       }
//     );
//     mongoose.disconnect();

//     expect(
//       ProductMovementModel.find().skip(1).limit(1).sort()
//     ).toHaveBeenCalled();
//   });
// });
// describe('When we call the countFilteredRecords method', () => {
//   test('Then the mongoose countDocuments method is called an it should return the mocked value', async () => {
//     const mockResult = 1;
//     const query = {
//       filterField: 'field',
//       filterValue: 'value',
//     };
//     (ProductMovementModel.countDocuments as jest.Mock).mockImplementation(
//       () => mockExecFunction(mockResult)
//     );
//     const result =
//       await instanceOfProductMovementsMongoRepo.countFilteredRecords(query);
//     mongoose.disconnect();
//     expect(ProductMovementModel.countDocuments).toHaveBeenCalled();
//     expect(result).toEqual(mockResult);
//   });
// });
