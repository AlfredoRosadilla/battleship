export default (function () {
  let codes = {
    SUCCESS: {
      200: 'OK',
      201: 'Created',
      202: 'Accepted',
      204: 'No Content',
    },
    REDIRECTION: {
      301: 'Moved Permanently',
      302: 'Found',
      304: 'Not Modified',
    },
    CLIENT_ERROR: {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      405: 'Method Not Allowed',
      406: 'Not Acceptable',
      409: 'Conflict',
      410: 'Gone',
      429: 'Too Many Requests',
    },
    SERVER_ERROR: {
      500: 'Internal Server Error',
      501: 'Not Implemented',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
      504: 'Gateway Timeout',
    },
  };

  Object.keys(codes).forEach((httpGroup) => {
    Object.keys(codes[httpGroup]).forEach((httpCode) => {
      codes[httpGroup][
        httpCode
      ] = `${httpCode} - ${codes[httpGroup][httpCode]}`;
    });
  });

  const RAW_HTTP_CODES = {
    ...codes.SUCCESS,
    ...codes.REDIRECTION,
    ...codes.CLIENT_ERROR,
    ...codes.SERVER_ERROR,
  };

  return {
    ...codes,
    getAllCodes() {
      return RAW_HTTP_CODES;
    },
    getCodeDescription(code) {
      return this.getAllCodes()[code];
    },
    getCodeByDescription(description) {
      const codeKeys = Object.keys(RAW_HTTP_CODES);

      return codeKeys.find((codeKey) =>
        RAW_HTTP_CODES[codeKey]
          .toLowerCase()
          .endsWith(description.toLowerCase()),
      );
    },
  };
})();
