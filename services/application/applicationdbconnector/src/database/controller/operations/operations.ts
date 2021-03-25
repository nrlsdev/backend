import { OperationsMessage } from '@backend/applicationmessagefactory';
import { StatusCodes } from '@backend/server';
import { Constants } from '@backend/constants';
import { Logger } from '@backend/logger';
import { PermissionEntity, doesOneObjectKeysExist, Permission, isJsonObject, findObjectFromArray } from '@backend/applicationinterfaces';
import { getModelByCollectionName } from '../../entities/dynamic/dynamic-schema';

const logger: Logger = new Logger('operations');

export async function dbPost(collection: string, data: any, userPermissions: PermissionEntity[], userId: string) {
  if (!isJsonObject(data)) {
    return OperationsMessage.postResponse(collection, undefined, StatusCodes.UNPROCESSABLE_ENTITY, 'Data object is not in JSON format.');
  }

  const blacklistKeywords: string[] = Constants.OPERATIONS_BLACKLIST_KEYWORDS;
  const dataContainsNotAllowedObject: boolean = doesOneObjectKeysExist(data, ...blacklistKeywords);

  if (dataContainsNotAllowedObject) {
    return OperationsMessage.postResponse(collection, undefined, StatusCodes.FORBIDDEN, `You are not allowed to use one of these keywords in your data object: ${blacklistKeywords}`);
  }

  const DynamicModel = getModelByCollectionName(collection);
  const dbObject = new DynamicModel(data);

  dbObject.userPermissions.push({
    permissions: [Permission.READ, Permission.UPDATE, Permission.DELETE, Permission.CHANGE_PERMISSIONS],
    userId,
  });

  dbObject.userPermissions.push(...userPermissions);

  try {
    await dbObject.save();
  } catch (exception) {
    logger.error('dbPost', exception.toString());

    return OperationsMessage.postResponse(collection, undefined, StatusCodes.INTERNAL_SERVER_ERROR, exception.toString());
  }

  return OperationsMessage.postResponse(collection, dbObject, StatusCodes.OK);
}

export async function dbGet(collection: string, query: any, fields: string[], includeFields: boolean, userId: string) {
  if (!isJsonObject(query)) {
    return OperationsMessage.getResponse(collection, undefined, StatusCodes.UNPROCESSABLE_ENTITY, 'Query object is not in JSON format.');
  }

  const DynamicModel = getModelByCollectionName(collection);
  const includedFields = getIncludedFieldsObject(fields, includeFields);
  let dbObjects: any[] = [];

  try {
    dbObjects = await DynamicModel.find(query, includedFields);
  } catch (exception) {
    logger.error('dbGet', exception.toString());

    return OperationsMessage.getResponse(collection, undefined, StatusCodes.INTERNAL_SERVER_ERROR, exception.toString());
  }

  const result: any[] = [];

  dbObjects.forEach((dbObject) => {
    if (PermissionEntity.isUserPermitted(dbObject.userPermissions, userId, Permission.READ)) {
      result.push(dbObject);
    }
  });

  return OperationsMessage.getResponse(collection, result, StatusCodes.OK);
}

export async function dbPut(collection: string, data: any, objectId: string, userId: string) {
  if (!isJsonObject(data)) {
    return OperationsMessage.putResponse(collection, undefined, StatusCodes.UNPROCESSABLE_ENTITY, 'Data object is not in JSON format.');
  }

  const blacklistKeywords: string[] = Constants.OPERATIONS_BLACKLIST_KEYWORDS;
  const dataContainsNotAllowedObject: boolean = doesOneObjectKeysExist(data, ...blacklistKeywords);

  if (dataContainsNotAllowedObject) {
    return OperationsMessage.putResponse(collection, undefined, StatusCodes.FORBIDDEN, `You are not allowed to use one of these keywords in your data object: ${blacklistKeywords}`);
  }

  const DynamicModel = getModelByCollectionName(collection);
  let dbObject;

  try {
    dbObject = await DynamicModel.findById(objectId);
  } catch (exception) {
    logger.error('dbPut', exception.toString());

    return OperationsMessage.deleteResponse(collection, undefined, StatusCodes.INTERNAL_SERVER_ERROR, exception.toString());
  }

  if (!dbObject) {
    return OperationsMessage.putResponse(collection, undefined, StatusCodes.NOT_FOUND, `No object with id '${objectId}' in collection '${collection}' to update found.`);
  }

  if (!PermissionEntity.isUserPermitted(dbObject.userPermissions, userId, Permission.UPDATE)) {
    return OperationsMessage.putResponse(collection, undefined, StatusCodes.FORBIDDEN, `You do not have 'update' permissions to update object with id '${objectId}' in collection '${collection}'.`);
  }

  try {
    await DynamicModel.updateOne({ _id: objectId }, data);

    const result = await DynamicModel.findById(objectId);

    return OperationsMessage.putResponse(collection, result, StatusCodes.OK);
  } catch (exception) {
    logger.error('dbPut', exception.toString());

    return OperationsMessage.putResponse(collection, undefined, StatusCodes.INTERNAL_SERVER_ERROR, exception.toString());
  }
}

export async function dbDelete(collection: string, objectId: string, userId: string) {
  const DynamicModel = getModelByCollectionName(collection);
  let dbObject;

  try {
    dbObject = await DynamicModel.findById(objectId);
  } catch (exception) {
    logger.error('dbDelete', exception.toString());

    return OperationsMessage.deleteResponse(collection, undefined, StatusCodes.INTERNAL_SERVER_ERROR, exception.toString());
  }

  if (!dbObject) {
    return OperationsMessage.deleteResponse(collection, undefined, StatusCodes.NOT_FOUND, `No object with id '${objectId}' in collection '${collection}' to delete found.`);
  }

  if (!PermissionEntity.isUserPermitted(dbObject.userPermissions, userId, Permission.DELETE)) {
    return OperationsMessage.deleteResponse(collection, undefined, StatusCodes.FORBIDDEN, `You do not have 'delete' permissions to delete object with id '${objectId}' in collection '${collection}'.`);
  }

  try {
    const result = await DynamicModel.findById(objectId);

    await DynamicModel.deleteOne({ _id: objectId });

    return OperationsMessage.deleteResponse(collection, result, StatusCodes.OK);
  } catch (exception) {
    logger.error('dbDelete', exception.toString());

    return OperationsMessage.deleteResponse(collection, undefined, StatusCodes.INTERNAL_SERVER_ERROR, exception.toString());
  }
}

export async function dbChangePermission(collection: string, objectId: string, userPermissions: PermissionEntity[], userId: string) {
  const DynamicModel = getModelByCollectionName(collection);
  let dbObject;

  try {
    dbObject = await DynamicModel.findById(objectId);
  } catch (exception) {
    logger.error('dbChangePermission', exception.toString());

    return OperationsMessage.changePermissionResponse(StatusCodes.INTERNAL_SERVER_ERROR, exception.toString());
  }

  if (!dbObject) {
    return OperationsMessage.changePermissionResponse(StatusCodes.NOT_FOUND, `No object with id '${objectId}' in collection '${collection}' to update permissions found.`);
  }

  if (!PermissionEntity.isUserPermitted(dbObject.userPermissions, userId, Permission.CHANGE_PERMISSIONS)) {
    return OperationsMessage.changePermissionResponse(StatusCodes.FORBIDDEN,
      `You do not have 'change_permissions' permissions to change permissions of object with id '${objectId}' in collection '${collection}'.`);
  }

  let dbUserPermissions: PermissionEntity[] = dbObject.userPermissions;

  userPermissions.forEach((userPermission: PermissionEntity) => {
    const result = findObjectFromArray('userId', userPermission.userId, dbUserPermissions);

    if (result.length > 0) {
      for (let i = 0; i < dbUserPermissions.length; i += 1) {
        if (dbUserPermissions[i].userId.toString() === userPermission.userId.toString()) {
          if (userPermission.permissions.length > 0) {
            dbUserPermissions[i] = userPermission;
          } else {
            dbUserPermissions = dbUserPermissions.filter((filterObject) => {
              return filterObject.userId.toString() !== userPermission.userId.toString();
            });
          }
        }
      }
    } else {
      dbUserPermissions.push(userPermission);
    }
  });

  dbObject.userPermissions = dbUserPermissions;

  try {
    await dbObject.save();
  } catch (exception) {
    logger.error('dbChangePermission', exception.toString());

    return OperationsMessage.changePermissionResponse(StatusCodes.INTERNAL_SERVER_ERROR, exception.toString());
  }

  return OperationsMessage.changePermissionResponse(StatusCodes.OK);
}

function getIncludedFieldsObject(fields: string[], includeFields: boolean) {
  const includedFields: any = {};

  fields.forEach((field: string) => {
    includedFields[field] = includeFields ? 1 : 0;
  });

  if (includeFields) {
    Constants.OPERATIONS_BLACKLIST_KEYWORDS.forEach((blacklistKeyword: string) => {
      includedFields[blacklistKeyword] = 1;
    });
  }

  return includedFields;
}
