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

export async function dbGet(
  collection: string,
  queryObject: any,
  fields: string[],
) {
  try {
    const CustomModel = getModelByCollectionName(collection);
    const propertiesToGet = getPropertiesObjectFromArray(fields);
    const dbObject = await CustomModel.find(queryObject, propertiesToGet);

    if (dbObject.length <= 0) {
      return OperationsMessage.getResponse(
        null,
        StatusCodes.NOT_FOUND,
        'No object(s) found.',
      );
    }

    return OperationsMessage.getResponse(
      dbObject.length > 1 ? dbObject : dbObject[0],
      StatusCodes.OK,
    );
  } catch (exception) {
    return OperationsMessage.getResponse(
      null,
      StatusCodes.INTERNAL_SERVER_ERROR,
      exception.toString(),
    );
  }
}

export async function dbPut(
  collection: string,
  queryObject: any,
  updateObject: any,
) {
  try {
    const CustomModel = getModelByCollectionName(collection);
    const dbObject = await CustomModel.find(queryObject);

    if (dbObject.length <= 0) {
      return OperationsMessage.putResponse(
        StatusCodes.NOT_FOUND,
        'No object(s) to update found.',
      );
    }

    if (dbObject.length > 1) {
      return OperationsMessage.putResponse(
        StatusCodes.CONFLICT,
        'Could not update object. More than one object found.',
      );
    }

    await CustomModel.updateOne(queryObject, updateObject);

    return OperationsMessage.putResponse(StatusCodes.OK);
  } catch (exception) {
    return OperationsMessage.putResponse(
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

function getPropertiesObjectFromArray(fields: string[]) {
  const properties: any = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const key of fields) {
    properties[key] = 1;
  }

  properties.__v = 0;

  return properties;
}
