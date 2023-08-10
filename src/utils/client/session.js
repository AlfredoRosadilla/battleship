import getConfig from 'next/config';

import requestHandler from './requestHandler';
import { COOKIE_USER_DATA_NAME, COOKIE_SESSION_NAME } from './../session';

const { publicRuntimeConfig } = getConfig();

export function getUserDataFromCookies() {
  const value = '; ' + document.cookie;
  const parts = value.split('; ' + COOKIE_USER_DATA_NAME + '=');

  if (parts.length === 2) {
    return JSON.parse(parts.pop().split(';').shift());
  }
}

/**
 * Given an username and a password, try to login
 * @param {string} username
 * @param {string} password
 * @returns {object} log data
 */
export async function login(username, password) {
  const { SERVER } = publicRuntimeConfig;

  try {
    await requestHandler.post({
      url: SERVER.URLS.LOGIN,
      body: {
        username,
        password,
      },
    });

    return username;
  } catch (error) {
    console.log(error);

    throw error;
  }
}

/**
 * Registro de usuarios
 * @param {String} email
 * @param {String} password
 * @returns
 */
export async function signIn(email, password) {
  const { SERVER } = publicRuntimeConfig;

  try {
    const { data } = await requestHandler.post({
      url: SERVER.URLS.REGISTER,
      body: {
        email,
        password,
      },
    });

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * Verificación de la cuenta del usuario desde el correo
 * @param {String} verifyCode
 * @returns
 */
export async function verifyAccount(verifyCode) {
  const { SERVER } = publicRuntimeConfig;

  try {
    const { data } = await await requestHandler.post({
      url: SERVER.URLS.VERIFY_ACCOUNT,
      body: {
        verifyCode,
      },
    });

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function deleteCookie(name) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export async function logOut() {
  deleteCookie(COOKIE_SESSION_NAME);
  deleteCookie(COOKIE_USER_DATA_NAME);
}
