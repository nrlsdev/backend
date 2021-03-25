// ToDo: improve, refactor, check matching objects no matter what order
export function objectEquals(obj1: any, obj2: any) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys1) {
    const value1 = obj1[key];
    const value2 = obj2[key];
    let equals: boolean = true;

    if (value1 instanceof Object && value2 instanceof Object) {
      equals = objectEquals(value1, value2);
    } else {
      equals = value1 === value2;
    }
    if (!equals) {
      return false;
    }
  }

  return true;
}

export function minifyObject(obj: any) {
  const keys = Object.keys(obj);
  const minifiedObject = obj;

  keys.forEach((key: string) => {
    const field = minifiedObject[key];

    if (field === undefined || field === null || field === '') {
      delete minifiedObject[key];
    } else if (field instanceof Object) {
      minifyObject(field);
    }
  });

  return minifiedObject;
}

export function copyObject(obj: any) {
  return JSON.parse(JSON.stringify(obj)); // ToDo: Refactor, deep copy changes both objects???
}

export function findObjectFromArray(key: any, value: any, array: any[]) {
  if (!key || !value || !array) {
    return [];
  }

  const result = array.filter((object: any) => {
    return object[key].toString() === value.toString();
  });

  return result;
}

export function doesObjectKeyExist(object: any, key: string) {
  const objectKeys = Object.keys(object);
  let doesKeyExist: boolean = false;

  objectKeys.forEach((objectKey: string) => {
    const field = object[objectKey];

    if (objectKeys.includes(key)) {
      doesKeyExist = true;
    }

    if (field instanceof Object) {
      if (!doesKeyExist) {
        doesKeyExist = doesObjectKeyExist(field, key);
      }
    }
  });

  return doesKeyExist;
}

export function doesObjectKeysExist(object: any, ...keys: string[]) {
  let doesKeysExist: boolean = true;

  keys.forEach((key: string) => {
    if (doesKeysExist) {
      if (!doesObjectKeyExist(object, key)) {
        doesKeysExist = false;
      }
    }
  });

  return doesKeysExist;
}

export function doesOneObjectKeysExist(object: any, ...keys: string[]) {
  let doesOneKeyExist: boolean = false;

  keys.forEach((key: string) => {
    if (!doesOneKeyExist) {
      if (doesObjectKeyExist(object, key)) {
        doesOneKeyExist = true;
      }
    }
  });

  return doesOneKeyExist;
}

export function isJsonObject(object: any) {
  try {
    JSON.parse(JSON.stringify(object));
  } catch {
    return false;
  }
  return true;
}
