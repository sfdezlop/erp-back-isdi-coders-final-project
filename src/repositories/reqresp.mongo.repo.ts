import createDebug from 'debug';
import { ReqRespModel } from './reqresp.mongo.model.js';
import { ReqResp } from '../entities/reqresp.entity';

const debug = createDebug('ERP:repo:reqresp');

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

  async create(): Promise<ReqResp> {
    debug('Instantiated at constructor at create method');

    const data = await ReqRespModel.create({ request: 'morganStreamToString' });
    return data;
  }
}
