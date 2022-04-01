const { name } = require('./package.json');
console.log(name)

module.exports = {
  webpack: function override(config, env) {
    // console.log(111)
    // console.log(config.entry)
    // console.log(111)
    // config.entry = config.entry.filter(
    //   (e) => !e.includes('webpackHotDevClient')
    // );

    config.output.library = `${name}-[name]`;
    config.output.libraryTarget = 'umd';
    // config.output.chunkLoadingGlobal = `webpackJsonp_${name}`;
    return config;
  },
  devServer: (configFunction) => {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      config.open = false;
      config.hot = false;
      config.headers = {
        'Access-Control-Allow-Origin': '*',
      };
      // Return your customised Webpack Development Server config.
      return config;
    };
  },
};