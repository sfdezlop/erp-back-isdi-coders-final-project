import { Schema, model } from 'mongoose';
import { MenuOption } from '../entities/menuoption.entity';

const menuOptionSchema = new Schema<MenuOption>({
  userRole: {
    type: String,
    required: true,
  },
  label: {
    type: String,
  },
  path: {
    type: String,
  },
});

menuOptionSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.passwd;
  },
});

export const MenuOptionModel = model(
  'MenuOption',
  menuOptionSchema,
  'menuoptions'
);
