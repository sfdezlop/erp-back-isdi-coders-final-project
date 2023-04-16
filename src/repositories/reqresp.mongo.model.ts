import { Schema, model } from 'mongoose';
import { ReqResp } from '../entities/reqresp.entity';

const userSchema = new Schema<ReqResp>({
  date: {
    type: Date,
  },
  userEmail: {
    type: String,
  },
  userToken: {
    type: String,
  },
  request: {
    type: String,
  },
  response: {
    type: String,
  },
  effort: {
    type: String,
  },
});

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.userToken;
  },
});

export const ReqRespModel = model('ReqResp', userSchema, 'reqresps');
