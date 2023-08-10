/**
 * Append new query params to the current url
 * and returns the corresponding value
 * @param {{key: string, value: string}} queryParams current query params
 * @param {[{key: string, value: string}]} filters new query params to add
 * @returns {string} query params url
 */
export function getAppendedQueryParams(queryParams, filters) {
  const _queryParams = { ...queryParams };
  const urlSearchParameters = new URLSearchParams();

  filters.forEach(({ key, value }) => {
    if (value !== null) {
      _queryParams[key] = value;
    } else {
      delete _queryParams[key];
    }
  });

  Object.entries(_queryParams).forEach(([queryKey, queryValue]) => {
    urlSearchParameters.append(queryKey, queryValue);
  });

  return urlSearchParameters.toString();
}
