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
  fieldType: {
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
    default: false,
  },
  searchable: {
    type: Boolean,
    required: true,
    default: false,
  },
  orderable: {
    type: Boolean,
    required: true,
    default: false,
  },
  htmlTag: {
    type: String,
    required: true,
    default: 'div',
  },
  mongoType: {
    type: String,
    required: true,
  },
  createShow: {
    type: String,
    required: true,
    default: '000',
  },
  detailShow: {
    type: String,
    required: true,
    default: '000',
  },
  galleryShow: {
    type: String,
    required: true,
    default: '000',
  },

  updateShow: {
    type: String,
    required: true,
    default: '000',
  },

  relatedInfo: {
    type: String,
    default: '',
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
