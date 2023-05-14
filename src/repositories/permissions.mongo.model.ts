import { Schema, model } from 'mongoose';
import { Permission } from '../entities/permission.entity';

export const permissionSchema = new Schema<Permission>({
  userEmail: {
    type: String,
    required: true,
  },
  collectionName: {
    type: String,
  },
  permission: {
    type: String,
  },
  active: {
    type: Boolean,
  },
});

permissionSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

export const PermissionModel = model(
  'Permission',
  permissionSchema,
  'permissions'
);
