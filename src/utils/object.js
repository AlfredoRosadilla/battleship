export function removeUndefined(baseObject) {
  return Object.entries(baseObject).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});
}
