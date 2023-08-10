module.exports = () => {
  const env = {};

  const serverRuntimeConfig = (function () {
    return {};
  })();

  const publicRuntimeConfig = (function () {
    return {};
  })();

  return {
    env,
    serverRuntimeConfig,
    publicRuntimeConfig,
    pageExtensions: ['jsx'],
    webpack: (config) => {
      config.module.rules.push({
        test: /\.test.js$/,
        loader: 'ignore-loader',
      });

      return config;
    },
  };
};
