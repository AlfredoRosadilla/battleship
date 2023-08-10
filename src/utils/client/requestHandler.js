import axios from 'axios';

import HTTP_CODES from './../httpsCodes';
import { removeUndefined } from './../object';
import { encryptDataBeforeSent } from './crypto';

async function proxy(methodName, url, rawParameters) {
  try {
    const { body, ...parameters } = removeUndefined(rawParameters);

    if (body) {
      return await axios[methodName](
        url,
        { data: encryptDataBeforeSent(body) },
        parameters,
      );
    } else {
      return await axios[methodName](url, parameters);
    }
  } catch (error) {
    let errorDescription = HTTP_CODES.SERVER_ERROR[500];

    if (error.response) {
      errorDescription = HTTP_CODES.getCodeDescription(error.response.status);
    } else if (error.request) {
      errorDescription = HTTP_CODES.CLIENT_ERROR[400];
    }

    throw new Error(errorDescription);
  }
}

async function get({ url, headers, queryParams, ...otherParameters }) {
  return await proxy('get', url, {
    headers,
    params: queryParams,
    ...otherParameters,
  });
}

async function post({ url, body, headers, queryParams, ...otherParameters }) {
  return await proxy('post', url, {
    body,
    headers,
    params: queryParams,
    ...otherParameters,
  });
}

async function put({ url, body, headers, queryParams, ...otherParameters }) {
  return await proxy('put', url, {
    body,
    headers,
    params: queryParams,
    ...otherParameters,
  });
}

export default {
  get,
  post,
  put,
};
