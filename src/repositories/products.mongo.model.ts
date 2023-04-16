import { Schema, model } from 'mongoose';
// Import { dbConnect } from '../db/db.connect';
import { Product } from '../entities/product.entity';

const productSchema = new Schema<Product>({
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

// ProductModel.aggregate([
//   {
//     $addFields: {
//       yearOfDate: {
//         $substr: ['$Date', 0, 4],
//       },
//       monthOfDate: {
//         $substr: ['$Date', 5, 2],
//       },
//       dayOfDate: {
//         $substr: ['$Date', 8, 2],
//       },
//       yearMonthOfDate: {
//         $substr: ['$Date', 0, 7],
//       },
//       unitsXunitaryCost: {
//         $multiply: ['$units', '$costPerUnit'],
//       },
//     },
//   },
//   {
//     $group: {
//       _id: '$yearMonthOfDate',
//       totalValue: {
//         $sum: '$unitsXunitaryCost',
//       },
//     },
//   },
// ]);
