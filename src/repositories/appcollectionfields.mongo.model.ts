import { Schema, model } from 'mongoose';
import { AppCollectionField } from '../entities/appcollectionfields.entity';

export const appCollectionFieldSchema = new Schema<AppCollectionField>({
  collectionName: {
    type: String,
    required: true,
  },
  fieldName: {
    type: String,
    required: true,
  },
  fieldShortDescription: {
    type: String,
    required: true,
  },
  filterable: {
    type: Boolean,
    required: true,
  },
  searchable: {
    type: Boolean,
    required: true,
  },
  orderable: {
    type: Boolean,
    required: true,
  },
});

appCollectionFieldSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

export const AppCollectionFieldModel = model(
  'AppCollectionField',
  appCollectionFieldSchema,
  'appcollectionfields'
);
