import axios from 'axios';
import getConfig from 'next/config';

import HTTP_CODES from './../httpsCodes';
import { getAESDescryption } from './crypto';
import { removeUndefined } from './../object';
import { getTokenFromCookies, getTokenHeaderName } from './session';

const { serverRuntimeConfig } = getConfig();

export function getResolvedBody(req) {
  const { data } = req.body;

  return JSON.parse(getAESDescryption(data, process.env.CSR_ENCRYPT_SECRET));
}

async function proxy(methodName, url, rawParameters) {
  try {
    const { body, ...parameters } = removeUndefined(rawParameters);

    if (body) {
      return await axios[methodName](url, body, parameters);
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

async function setAuthorization(req, res, url, rawHeaders = {}) {
  const {
    SERVER: {
      URLS: { PROTECTED_URLS_PREFIX },
    },
  } = serverRuntimeConfig;

  const headers = { ...rawHeaders };
  const isProtected = url.startsWith(PROTECTED_URLS_PREFIX);

  if (isProtected) {
    const token = await getTokenFromCookies(req, res);
    const tokenHeaderName = await getTokenHeaderName(req, res);

    headers[tokenHeaderName] = token;
  }

  return headers;
}

async function get(
  req,
  res,
  { url, headers, queryParams, ...otherParameters },
) {
  return await proxy('get', url, {
    params: queryParams,
    headers: await setAuthorization(req, res, url, headers),
    ...otherParameters,
  });
}

async function post(
  req,
  res,
  { url, body, headers, queryParams, ...otherParameters },
) {
  return await proxy('post', url, {
    body,
    params: queryParams,
    headers: await setAuthorization(req, res, url, headers),
    ...otherParameters,
  });
}

async function put(
  req,
  res,
  { url, body, headers, queryParams, ...otherParameters },
) {
  return await proxy('put', url, {
    body,
    params: queryParams,
    headers: await setAuthorization(req, res, url, headers),
    ...otherParameters,
  });
}

export default {
  get,
  post,
  put,
};
