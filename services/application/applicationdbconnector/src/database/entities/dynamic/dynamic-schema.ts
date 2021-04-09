import { Permission, DynamicEntity, PermissionEntity } from '@backend/applicationinterfaces';
import { Model, models, Schema, model, Document, Types } from 'mongoose';

export function getModelByCollectionName(collection: string) {
  type DynamicEntityDocument = DynamicEntity & Document;
  type PermissionDocument = PermissionEntity & Document;

  let DynamicModel: Model<DynamicEntityDocument, {}> | null =
    models[collection];

  if (DynamicModel) {
    return DynamicModel;
  }

  const DynamicPermissionsSchema = new Schema<PermissionDocument>(
    {
      userId: {
        unique: false,
        required: true,
        type: Types.ObjectId,
      },
      permissions: {
        enum: [Permission],
        type: [String],
      },
    },
    {
      _id: false,
    },
  );

  const DynamicSchema = new Schema<DynamicEntityDocument>(
    {
      userPermissions: {
        unique: false,
        required: true,
        default: [],
        type: [DynamicPermissionsSchema],
      },
      creationDate: {
        unique: false,
        required: true,
        default: () => {
          return Date.now();
        },
        type: Number,
      },
    },
    { strict: false, collection },
  );

  DynamicModel = model(collection, DynamicSchema);

  return DynamicModel;
}
