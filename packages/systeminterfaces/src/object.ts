export function objectEquals(onject1: any, onject2: any) {
  const obj1Length = Object.keys(onject1).length;
  const obj2Length = Object.keys(onject2).length;

  if (obj1Length === obj2Length) {
    return Object.keys(onject1).every(
      // eslint-disable-next-line no-prototype-builtins
      (key) => onject2.hasOwnProperty(key) && onject2[key] === onject1[key],
    );
  }
  return false;
}

export function minifyObject(object: any) {
  const keys = Object.keys(object);
  const minifiedObject = object;

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
