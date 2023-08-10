import Cookies from 'cookies';
import getConfig from 'next/config';

import { decodeJWT } from './crypto';
import requestHandler from './requestHandler';
import { COOKIE_SESSION_NAME, COOKIE_USER_DATA_NAME } from './../session';

const { serverRuntimeConfig } = getConfig();

/**
 * Check if current thread is running in SSR or CRS
 * @returns {bool}
 */
export function isServerSide() {
  return typeof window === 'undefined';
}

/**
 * Regarding a token, the method validate
 * if its a valid one created by this system
 * If new token is valid, this method get a new one
 * in order to keep alive the current session.
 * If token is invalid returns an error in the log structure.
 * This method only can be use in SSR.
 * Require publicRuntimeConfig.SECRET_ENCRYPT wich is
 * used to create and validate the token
 * @param {string} token
 * @returns {object} log data
 */
function validateToken(token) {
  let logData = {
    token,
    email: null,
    isLogged: false,
    error: 'Invalid Token',
  };

  if (typeof token === 'string') {
    try {
      const { email, exp } = decodeJWT(token);
      const isTokenGranted = new Date(exp * 1000) >= new Date();

      if (!email) {
        throw 'Badly formed backend token';
      }

      if (isTokenGranted) {
        logData = {
          email,
          token,
          error: null,
          isLogged: true,
        };
      }
    } catch (error) {
      console.error(error);
    }
  }

  return logData;
}

/**
 * Ctx de next ya que la cookie viene en esa
 * comunicación
 */
export async function getTokenFromCookies(req, res) {
  const cookies = new Cookies(req, res);

  return cookies.get(COOKIE_SESSION_NAME);
}

/**
 * El token viene en el request que se hace desde axios
 * No los que esta manejando next, es por esto que para
 * sacar el token no se puede hacer directamente con
 * req y res
 */
export async function setTokenInCookies(req, res, token) {
  const cookies = new Cookies(req, res);

  cookies.set(COOKIE_SESSION_NAME, token, {
    httpOnly: false,
  });
}

export async function getUserDataFromCookies(req, res) {
  const cookies = new Cookies(req, res);

  return JSON.parse(cookies.get(COOKIE_USER_DATA_NAME) || '{}');
}

export async function setUserDataInCookies(req, res, userData) {
  const cookies = new Cookies(req, res);

  cookies.set(COOKIE_USER_DATA_NAME, JSON.stringify(userData), {
    httpOnly: false,
  });
}

/**
 * If there is a valid token let go to private route
 * If there is not a valid token redirects to fallback route
 * This method must be use inside getServerSideProps
 * @param {object} ctx
 * @param {string} fallback
 * @returns {object} ctx
 */
export async function handlePrivateRoute(ctx, callback, fallback = '/login') {
  /**
   * Valida credenciales
   */
  const { req, res, resolvedUrl } = ctx;
  const userData = await getUserDataFromCookies(req, res);
  const logData = validateToken(await getTokenFromCookies(req, res));
  let ctxResult = {
    redirect: {
      permanent: false,
      destination: fallback,
    },
  };

  /**
   * Si tiene las credenciales necesarias llama a la
   * callback para realizar las operaciones necesarias
   * en el SSR
   */
  if (logData.isLogged && userData) {
    const { initialRoute, routes } = userData;
    const externalContext = callback ? await callback(ctx) : {};

    if (routes.indexOf(resolvedUrl) !== -1) {
      ctxResult = {
        props: {
          ...logData,
          ...externalContext?.props,
        },
      };
    } else {
      // Si estoy logueado me lleva a la primera ruta del usuario
      ctxResult = {
        redirect: {
          permanent: false,
          destination: initialRoute,
        },
      };
    }
  }

  return ctxResult;
}

/**
 * Just for request in backend
 */
let sessionTokenHeaderName = null;
export async function getTokenHeaderName(req, res) {
  const { SERVER } = serverRuntimeConfig;

  if (!sessionTokenHeaderName) {
    const { data } = await requestHandler.get(req, res, {
      url: SERVER.URLS.GET_TOKEN_HEADER_NAME,
    });

    sessionTokenHeaderName = data.tokenHeaderName;
  }

  return sessionTokenHeaderName;
}

/**
 * Dado que hay dos niveles de comunicación, este token solamente
 * Lo obtiene el backend ya que el front puede obtener el token
 * y los datos desde la cookies
 */
export const getResponseToken = async function (req, res) {
  let token = null;

  await getTokenHeaderName(req, res);

  if (res && res.headers && sessionTokenHeaderName) {
    token = res?.headers[sessionTokenHeaderName] || null;
  }

  return token;
};
