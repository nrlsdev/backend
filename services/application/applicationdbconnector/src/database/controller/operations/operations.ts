import { OperationsMessage } from '@backend/applicationmessagefactory';
import { StatusCodes } from '@backend/server';
import { Constants } from '@backend/constants';
import { Logger } from '@backend/logger';
import { doesOneObjectKeysExist, isJsonObject, objectEquals } from '@backend/applicationinterfaces';
import { getModelByCollectionName } from '../../entities/dynamic/dynamic-schema';

const logger: Logger = new Logger('operations');

export async function dbPost(collection: string, data: any, _userId: string, custom: any) {
  if (!isJsonObject(data)) {
    return OperationsMessage.postResponse(collection, undefined, custom, StatusCodes.UNPROCESSABLE_ENTITY, 'Data object is not in JSON format.');
  }

  const blacklistKeywords: string[] = Constants.OPERATIONS_BLACKLIST_KEYWORDS;
  const dataContainsNotAllowedObject: boolean = doesOneObjectKeysExist(data, ...blacklistKeywords);

  if (dataContainsNotAllowedObject) {
    return OperationsMessage.postResponse(collection, undefined, custom, StatusCodes.FORBIDDEN, `You are not allowed to use one of these keywords in your data object: ${blacklistKeywords}`);
  }

  const DynamicModel = getModelByCollectionName(collection);
  const dbObject = new DynamicModel(data);

  try {
    await dbObject.save();
  } catch (exception) {
    logger.error('dbPost', exception.toString());

    return OperationsMessage.postResponse(collection, undefined, custom, StatusCodes.INTERNAL_SERVER_ERROR, exception.toString());
  }

  return OperationsMessage.postResponse(collection, dbObject, custom, StatusCodes.OK);
}

export async function dbGet(collection: string, entities: any, query: any, selectAll: boolean, _userId: string, custom: any) {
  if (!isJsonObject(entities)) {
    return OperationsMessage.postResponse(collection, undefined, custom, StatusCodes.UNPROCESSABLE_ENTITY, 'Hashed entities object is not in JSON format.');
  }

  const DynamicModel = getModelByCollectionName(collection);
  const ids: string[] = Object.keys(entities);
  let dbObjects: any[] = [];
  let idsToDelete: string[] = [];

  try {
    if (selectAll) {
      dbObjects = await DynamicModel.find();
    } else if (query !== undefined && !objectEquals(query, {})) {
      dbObjects = await DynamicModel.find(query);
    } else {
      dbObjects = await DynamicModel.find({
        _id: { $in: ids },
      });
    }

    const existingIds: string[] = [];

    dbObjects.forEach((dbObject: any) => {
      if (ids.includes(dbObject._id.toString())) {
        existingIds.push(dbObject._id.toString());
      }
    });

    idsToDelete = ids.filter(value => !existingIds.includes(value));

    dbObjects = dbObjects.filter((dbObject: any) => {
      return entities[dbObject._id] === undefined || entities[dbObject._id] < dbObject.__v;
    });
  } catch (exception) {
    logger.error('dbGet', exception.toString());

    return OperationsMessage.getResponse(collection, undefined, [], custom, StatusCodes.INTERNAL_SERVER_ERROR, exception.toString());
  }

  return OperationsMessage.getResponse(collection, dbObjects, idsToDelete, custom, StatusCodes.OK);
}

export async function dbPut(collection: string, data: any, objectId: string, _userId: string, custom: any) {
  if (!isJsonObject(data)) {
    return OperationsMessage.putResponse(collection, undefined, custom, StatusCodes.UNPROCESSABLE_ENTITY, 'Data object is not in JSON format.');
  }

  const blacklistKeywords: string[] = Constants.OPERATIONS_BLACKLIST_KEYWORDS;
  const dataContainsNotAllowedObject: boolean = doesOneObjectKeysExist(data, ...blacklistKeywords);

  if (dataContainsNotAllowedObject) {
    return OperationsMessage.putResponse(collection, undefined, custom, StatusCodes.FORBIDDEN, `You are not allowed to use one of these keywords in your data object: ${blacklistKeywords}`);
  }

  const DynamicModel = getModelByCollectionName(collection);
  let dbObject;

  try {
    dbObject = await DynamicModel.findById(objectId);
  } catch (exception) {
    logger.error('dbPut', exception.toString());

    return OperationsMessage.deleteResponse(collection, undefined, custom, StatusCodes.INTERNAL_SERVER_ERROR, exception.toString());
  }

  if (!dbObject) {
    return OperationsMessage.putResponse(collection, undefined, custom, StatusCodes.NOT_FOUND, `No object with id '${objectId}' in collection '${collection}' to update found.`);
  }

  try {
    // eslint-disable-next-line no-param-reassign
    data.__v = dbObject.__v ? dbObject.__v += 1 : 1;
    await DynamicModel.updateOne({ _id: objectId }, data);

    const result = await DynamicModel.findById(objectId);

    return OperationsMessage.putResponse(collection, result, custom, StatusCodes.OK);
  } catch (exception) {
    logger.error('dbPut', exception.toString());

    return OperationsMessage.putResponse(collection, undefined, custom, StatusCodes.INTERNAL_SERVER_ERROR, exception.toString());
  }
}

export async function dbDelete(collection: string, objectId: string, _userId: string, custom: any) {
  const DynamicModel = getModelByCollectionName(collection);
  let dbObject;

  try {
    dbObject = await DynamicModel.findById(objectId);
  } catch (exception) {
    logger.error('dbDelete', exception.toString());

    return OperationsMessage.deleteResponse(collection, undefined, custom, StatusCodes.INTERNAL_SERVER_ERROR, exception.toString());
  }

  if (!dbObject) {
    return OperationsMessage.deleteResponse(collection, undefined, custom, StatusCodes.NOT_FOUND, `No object with id '${objectId}' in collection '${collection}' to delete found.`);
  }

  try {
    const result = await DynamicModel.findById(objectId);

    await DynamicModel.deleteOne({ _id: objectId });

    return OperationsMessage.deleteResponse(collection, result, custom, StatusCodes.OK);
  } catch (exception) {
    logger.error('dbDelete', exception.toString());

    return OperationsMessage.deleteResponse(collection, undefined, custom, StatusCodes.INTERNAL_SERVER_ERROR, exception.toString());
  }
}
