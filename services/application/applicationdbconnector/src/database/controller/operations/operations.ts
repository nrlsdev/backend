import { OperationsMessage } from '@backend/applicationmessagefactory';
import { StatusCodes } from '@backend/server';
import { Schema, model, models, Model } from 'mongoose';

export async function dbPost(collection: string, data: any) {
  try {
    const CustomModel = getModelByCollectionName(collection);
    const dbObject = new CustomModel(data);

    await dbObject.save();

    return OperationsMessage.postResponse(dbObject._id, StatusCodes.OK);
  } catch (exception) {
    return OperationsMessage.postResponse(
      undefined,
      StatusCodes.INTERNAL_SERVER_ERROR,
      exception.toString(),
    );
  }
}

function getModelByCollectionName(collection: string) {
  let CollectionModel: Model<any, {}> | null = models[collection];

  if (CollectionModel) {
    return CollectionModel;
  }

  const CustomSchema = new Schema({}, { strict: false });
  CollectionModel = model(collection, CustomSchema);

  return CollectionModel;
}
