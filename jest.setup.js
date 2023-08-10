jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(() => ({
    route: '/',
    pathname: '',
    query: {},
    asPath: '',
    push: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
    beforePopState: jest.fn(() => null),
    prefetch: jest.fn(() => null),
  })),
}));

jest.mock('next/config', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    serverRuntimeConfig: {
      USER_MOCK_VALUE: 'ssr-user-mock',
      SECRET_ENCRYPT: 'ssr-secret-mock',
      PASSWORD_MOCK_VALUE: 'ssr-password-mock',
    },
  })),
}));

jest.mock('cookies', () => ({
  __esModule: true,
  default: function Cookies(req = {}) {
    this.get = jest.fn(() => req.mockedCookie);
    this.set = jest.fn();
  },
}));
