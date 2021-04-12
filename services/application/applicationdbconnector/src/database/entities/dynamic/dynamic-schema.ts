import { DynamicEntity } from '@backend/applicationinterfaces';
import { Model, models, Schema, model, Document } from 'mongoose';

export function getModelByCollectionName(collection: string) {
  type DynamicEntityDocument = DynamicEntity & Document;

  let DynamicModel: Model<DynamicEntityDocument, {}> | null =
    models[collection];

  if (DynamicModel) {
    return DynamicModel;
  }

  const DynamicSchema = new Schema<DynamicEntityDocument>({},
    { strict: false, collection },
  );

  DynamicModel = model(collection, DynamicSchema);

  return DynamicModel;
}
