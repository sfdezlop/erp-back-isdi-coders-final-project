import { Schema, model } from 'mongoose';
import { Brand } from '../entities/brand.entity';

export const brandSchema = new Schema<Brand>({
  brandName: {
    type: String,
    required: true,
    unique: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  web: {
    type: String,
    required: true,
  },
});

brandSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

export const BrandModel = model('Brand', brandSchema, 'brands');
