import { Schema, model } from 'mongoose';
// Import { dbConnect } from '../db/db.connect';
import { Product } from '../entities/product.entity';

export const productSchema = new Schema<Product>({
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  longDescription: {
    type: String,
  },
  ean: {
    type: String,
  },
  brand: {
    type: String,
  },
  image: {
    type: String,
  },

  userCreatorEmail: {
    type: String,
  },

  costPerUnit: {
    type: Number,
  },
  pricePerUnit: {
    type: Number,
  },
});

productSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

export const ProductModel = model('Product', productSchema, 'products');
