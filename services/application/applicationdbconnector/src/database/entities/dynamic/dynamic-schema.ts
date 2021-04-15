import { getModelForClass, modelOptions, Severity } from '@typegoose/typegoose';
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
  return getModelForClass(DynamicSchema, {
    schemaOptions: {
      collection,
    },
  });
}
