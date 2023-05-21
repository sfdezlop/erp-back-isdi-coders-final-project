import { Schema, model } from 'mongoose';
import { RequestLog } from '../entities/requestlog.entity';

export const requestLogSchema = new Schema<RequestLog>({
  timeStamp: {
    type: Date,
    required: true,
  },
  userLoggedToken: {
    type: String,
  },
  userHost: {
    type: String,
  },
  method: {
    type: String,
  },
  url: {
    type: String,
  },
  statusCode: {
    type: Number,
  },
  responseLength: {
    type: Number,
  },
  responseTimeMs: {
    type: Number,
  },
});

requestLogSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

export const RequestLogModel = model(
  'RequestLog',
  requestLogSchema,
  'requestlog'
);
