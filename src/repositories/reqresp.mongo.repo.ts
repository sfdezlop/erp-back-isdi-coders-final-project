import createDebug from 'debug';
import { Repo } from './repo.interface';
import { ReqRespModel } from './reqresp.mongo.model.js';
import { ReqResp } from '../entities/reqresp.entity';

const debug = createDebug('ERP:repo:users');

export class ReqRespMongoRepo {
  private static instance: ReqRespMongoRepo;

  public static getInstance(): ReqRespMongoRepo {
    if (!ReqRespMongoRepo.instance) {
      ReqRespMongoRepo.instance = new ReqRespMongoRepo();
    }

    return ReqRespMongoRepo.instance;
  }

  private constructor() {
    debug('Instantiated at constructor');
  }

  async query(): Promise<ReqResp[]> {
    debug('Instantiated at constructor at query method');
    const data = await ReqRespModel.find();
    return data;
  }

  async create(info: Partial<ReqResp>): Promise<ReqResp> {
    debug('Instantiated at constructor at create method');
    const data = await ReqRespModel.create(info);
    return data;
  }
}
