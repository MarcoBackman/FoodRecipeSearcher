let {createProxyMiddleware} = require('http-proxy-middleware');
const config = require("../../config.json");

module.exports = function initializeProxy(app) {
    let serverUri = `http://${config.server.host}:${config.server.port}`;
    app.use(
        '/api/recipe/',
        createProxyMiddleware({
            target: serverUri,
            changeOrigin: true
        })
    );
};
