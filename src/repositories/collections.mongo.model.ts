import { Schema, model } from 'mongoose';
import { Collection } from '../entities/collection.entity';
import { appCollectionFieldSchema } from './appcollectionfields.mongo.model';
import { productSchema } from './products.mongo.model';
import { productMovementSchema } from './productmovements.mongo.model';
import { translationSchema } from './translations.mongo.model';
import { userSchema } from './users.mongo.model';

const collectionSchema = new Schema<Collection>({
  appcollectionfields: appCollectionFieldSchema,
  productmovements: productMovementSchema,
  products: productSchema,
  translations: translationSchema,
  users: userSchema,
});

translationSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.users.passwd;
  },
});

export const CollectionModel = model(
  'Collection',
  collectionSchema,
  'collections'
);
