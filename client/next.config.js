const withCSS = require('@zeit/next-css');
module.exports = withCSS({
    publicRuntimeConfig: {
        APP_NAME: 'NODE-REACT-AWS',
        API: 'http://localhost:5000/api',
        PRODUCTION: false,
        DOMAIN: 'http://localhost:3000',
        FB_APP_ID: 'JJSLKADFLKSAHFDSLKL'
    }
});
