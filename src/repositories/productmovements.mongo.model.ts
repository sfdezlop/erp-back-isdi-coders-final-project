import { Schema, model } from 'mongoose';
import { ProductMovement } from '../entities/productmovement.entity';

export const productMovementSchema = new Schema<ProductMovement>({
  productSku: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
  },
  date: {
    type: String,
  },
  type: {
    type: String,
  },
  typeId: {
    type: String,
  },

  store: {
    type: String,
  },
  units: {
    type: Number,
  },
  costPerUnit: {
    type: Number,
  },
  pricePerUnit: {
    type: Number,
  },
});

productMovementSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

export const ProductMovementModel = model(
  'ProductMovement',
  productMovementSchema,
  'productmovements'
);
