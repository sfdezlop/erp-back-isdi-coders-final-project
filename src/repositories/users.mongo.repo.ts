import createDebug from 'debug';
import { User } from '../entities/user.entity';
import { HTTPError } from '../interfaces/error.js';
import { UserModel } from './users.mongo.model.js';
const debug = createDebug('ERP:repo:users');

export class UsersMongoRepo {
  private static instance: UsersMongoRepo;

  public static getInstance(): UsersMongoRepo {
    if (!UsersMongoRepo.instance) {
      UsersMongoRepo.instance = new UsersMongoRepo();
    }

    return UsersMongoRepo.instance;
  }

  private constructor() {
    debug('Instantiated at constructor');
  }

  async query(): Promise<User[]> {
    debug('Instantiated at constructor at query method');
    const data = await UserModel.find();
    return data;
  }

  async queryId(id: string): Promise<User> {
    debug('Instantiated at constructor at queryId method');
    const data = await UserModel.findById(id);
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found in queryId');
    return data;
  }

  async search(query: { key: string; value: unknown }): Promise<User[]> {
    debug('Instantiated at constructor at search method');
    const data = await UserModel.find({ [query.key]: query.value });
    return data;
  }

  async create(info: Partial<User>): Promise<User> {
    debug('Instantiated at constructor at create method');
    const data = await UserModel.create(info);
    return data;
  }

  async update(info: Partial<User>): Promise<User> {
    debug('Instantiated at constructor at update method');
    const data = await UserModel.findByIdAndUpdate(info.id, info, {
      new: true,
    });
    if (!data)
      throw new HTTPError(404, 'Record not found', 'Id not found in update');
    return data;
  }

  async destroy(id: string): Promise<void> {
    debug(id);
    const data = await UserModel.findByIdAndDelete(id);
    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Delete not possible: id not found'
      );
  }

  async countRecords(): Promise<number> {
    debug('Instantiated at constructor at count method');
    const data = await UserModel.countDocuments();
    return data;
  }
}
