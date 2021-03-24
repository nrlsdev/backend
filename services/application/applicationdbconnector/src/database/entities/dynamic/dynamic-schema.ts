import { Permission, PermissionsEntity } from '@backend/applicationinterfaces';
import { Model, models, Schema, model, Document, Types } from 'mongoose';

export function getModelByCollectionName(collection: string) {
  type PermissionsEntityDocument = PermissionsEntity & Document;
  let DynamicModel: Model<PermissionsEntityDocument, {}> | null =
    models[collection];

  if (DynamicModel) {
    return DynamicModel;
  }

  const DynamicPermissionsSchema = new Schema<PermissionsEntityDocument>(
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

  const DynamicSchema = new Schema<PermissionsEntityDocument>(
    {
      userPermissions: {
        unique: false,
        required: true,
        default: [],
        type: [DynamicPermissionsSchema],
      },
    },
    { strict: false },
  );

  DynamicModel = model(collection, DynamicSchema);

  return DynamicModel;
}
