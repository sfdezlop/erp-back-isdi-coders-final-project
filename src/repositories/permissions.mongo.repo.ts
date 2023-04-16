import createDebug from 'debug';
import { Permission } from '../entities/permission.entity';
import { PermissionModel } from './permissions.mongo.model.js';
const debug = createDebug('ERP:repo:permissions');

export class PermissionsMongoRepo {
  private static instance: PermissionsMongoRepo;

  public static getInstance(): PermissionsMongoRepo {
    if (!PermissionsMongoRepo.instance) {
      PermissionsMongoRepo.instance = new PermissionsMongoRepo();
    }

    return PermissionsMongoRepo.instance;
  }

  private constructor() {
    debug('Instantiated at constructor');
  }

  async search(query: { key: string; value: unknown }): Promise<Permission[]> {
    debug('Instantiated at constructor at search method');
    const data = await PermissionModel.find({ [query.key]: query.value });
    return data;
  }
}
