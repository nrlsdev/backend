import { deleteModelWithClass, getModelForClass, modelOptions, Severity } from '@typegoose/typegoose';
import { connection } from 'mongoose';
import { DatabaseEntitySchema } from '../database-entity-schema';

@modelOptions({
  options: {
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
  schemaOptions: {
    strict: false,
  },
})
export class DynamicSchema extends DatabaseEntitySchema { }

export function getModelByCollectionName(collection: string) {
  if (connection.models.DynamicSchema) {
    deleteModelWithClass(DynamicSchema);
  }

  const DynamicModel = getModelForClass(DynamicSchema, {
    schemaOptions: {
      collection,
    },
  });

  return DynamicModel;
}
