import { Schema, model } from 'mongoose';
import {
  Translation,
  TranslationOutputText,
} from '../entities/translation.entity';

export const translationOutputTextSchema = new Schema<TranslationOutputText>(
  {
    isoCode: {
      type: String,
      unique: true,
    },
    outputText: {
      type: String,
      required: true,
      default: '',
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export const translationSchema = new Schema<Translation>(
  {
    inputText: {
      type: String,
      required: true,
      unique: true,
    },
    outputTexts: [translationOutputTextSchema],
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

translationSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

export const TranslationModel = model(
  'Translation',
  translationSchema,
  'translations'
);
