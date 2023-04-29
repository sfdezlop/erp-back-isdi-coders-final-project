import { ProductsMongoRepo } from './products.mongo.repo.js';
import { ProductModel } from './products.mongo.model';
import mongoose from 'mongoose';
import { HTTPError } from '../interfaces/error.js';

jest.mock('./products.mongo.model.js');

describe('Given a new ProductsMongoRepo created with a public static function (to follow singleton patron)', () => {
  const instanceOfProductsMongoRepo = ProductsMongoRepo.getInstance();
  describe('When we call this function ', () => {
    test('Then Products Mongo Repo should be instanciated', () => {
      expect(instanceOfProductsMongoRepo).toBeInstanceOf(ProductsMongoRepo);
    });
  });

  describe('When we use the queryId method', () => {
    test('Then it should return the mocked data', async () => {
      const mock = { id: '2' };
      (ProductModel.findById as jest.Mock).mockResolvedValue(mock);
      const result = await instanceOfProductsMongoRepo.queryId('2');
      mongoose.disconnect();
      expect(ProductModel.findById).toHaveBeenCalled();
      expect(result).toBe(mock);
    });
  });

  describe('When we use the leftJoinProductMovements', () => {
    test('Then the aggregate mongoose method should be called', async () => {
      (ProductModel.aggregate as jest.Mock).mockResolvedValue([]);
      await instanceOfProductsMongoRepo.leftJoinProductMovements();
      mongoose.disconnect();
      expect(ProductModel.aggregate).toHaveBeenCalled();
    });
  });

  describe('When we use the queryByKey', () => {
    test('Then the find mongoose method should be called', async () => {
      (ProductModel.find as jest.Mock).mockResolvedValue([]);
      await instanceOfProductsMongoRepo.queryByKey({
        key: 'mock',
        value: 'mock',
      });
      mongoose.disconnect();
      expect(ProductModel.find).toHaveBeenCalled();
    });
  });

  describe('When we use the create method', () => {
    test('Then it should return the new mocked data', async () => {
      const mock = { id: '2' };
      (ProductModel.create as jest.Mock).mockResolvedValue(mock);
      const result = await instanceOfProductsMongoRepo.create(mock);
      expect(ProductModel.create).toHaveBeenCalled();
      expect(result.id).toBe('2');
      mongoose.disconnect();
    });
  });

  describe('When we use the update method to a record that exists', () => {
    test('Then it should update the value at the selected field for the indicated id', async () => {
      (ProductModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        id: '1',
        field: 'newvalue',
      });
      const mockUser = {
        id: '1',
        field: 'newvalue',
      };
      const result = await instanceOfProductsMongoRepo.update(mockUser);
      mongoose.disconnect();
      expect(ProductModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual({
        id: '1',
        field: 'newvalue',
      });
    });
  });

  describe('When we use the deleteById method ', () => {
    test('Then the mongoose method findByIdAndDelete is called', async () => {
      (ProductModel.findByIdAndDelete as jest.Mock).mockResolvedValue(1);
      const mockUserId = '1';
      await instanceOfProductsMongoRepo.deleteById(mockUserId);
      mongoose.disconnect();
      expect(ProductModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });

  describe('When we use the deleteById method to a record that exists', () => {
    test('Then it should delete the record', async () => {
      (ProductModel.findByIdAndDelete as jest.Mock).mockResolvedValue({});
      const mockId = '2';
      const result = await instanceOfProductsMongoRepo.deleteById(mockId);
      mongoose.disconnect();
      expect(ProductModel.findByIdAndDelete).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('When we use the deleteById method to a record that does not exists ', () => {
    test('Then it should throw an error of key and value not found', async () => {
      (ProductModel.findByIdAndDelete as jest.Mock).mockResolvedValue(
        undefined
      );
      expect(() => instanceOfProductsMongoRepo.deleteById('')).rejects.toThrow(
        HTTPError
      );
      mongoose.disconnect();
    });
  });

  describe('When we use the deleteByKey method to a record that exists', () => {
    test('Then it should delete the record', async () => {
      (ProductModel.findByIdAndDelete as jest.Mock).mockResolvedValue({});

      const result = await instanceOfProductsMongoRepo.deleteByKey(
        'key',
        'value'
      );
      mongoose.disconnect();
      expect(ProductModel.findByIdAndDelete).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });
  describe('When we use the deleteByKey method to a record that does not exists ', () => {
    test('Then it should throw an error of key and value not found', async () => {
      (ProductModel.findByIdAndDelete as jest.Mock).mockResolvedValue(
        undefined
      );
      expect(() =>
        instanceOfProductsMongoRepo.deleteByKey('', '')
      ).rejects.toThrow(HTTPError);
      mongoose.disconnect();
    });
  });

  describe('When we use the groupValuesPerField', () => {
    test('Then the aggregate mongoose method should be called', async () => {
      (ProductModel.aggregate as jest.Mock).mockResolvedValue([]);
      await instanceOfProductsMongoRepo.groupValuesPerField('mock');
      mongoose.disconnect();
      expect(ProductModel.aggregate).toHaveBeenCalled();
    });
  });

  describe('When we use the microserviceQueryByKeyValue method to a record that exists', () => {
    test('Then it should return data', async () => {
      (ProductModel.aggregate as jest.Mock).mockResolvedValue([
        {
          valueOfKey: '1',
        },
      ]);

      const result =
        await instanceOfProductsMongoRepo.microserviceQueryByKeyValue(
          'sku',
          '1',
          'sku'
        );
      mongoose.disconnect();
      expect(ProductModel.aggregate).toHaveBeenCalled();
      expect(result).toEqual('1');
    });
  });
  describe('When we use the microserviceQueryByKeyValue method to a record that does not exists ', () => {
    test('Then it should throw an error', async () => {
      (ProductModel.aggregate as jest.Mock).mockResolvedValue(undefined);
      expect(() =>
        instanceOfProductsMongoRepo.microserviceQueryByKeyValue(
          'inputKey',
          'inputValue',
          'outputKey'
        )
      ).rejects.toThrow(HTTPError);
      mongoose.disconnect();
    });
  });
});
