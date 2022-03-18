const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
const { API_SERVICE_URL, HOST, PORT } = require('./config');
const { APIUsesSQLiteRepo } = require('./db');

// Create Express Server
const app = express();

// Create DB instance
const apiUsesSQLiteRepo = new APIUsesSQLiteRepo()

// Logging
app.use(morgan('dev'));

// Proxy endpoints
app.use('/', createProxyMiddleware({
  target: API_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
      '^/ti': '',
      '^/doc': '',
      '^/acessoria': '',
  },
  onProxyRes: (proxyRes, req, res) => {
    if (proxyRes.statusCode < 400) {
      const match = req.originalUrl.match('^/([a-zA-Z0-9]+)')[1]
      switch (match) {
        case 'ti': apiUsesSQLiteRepo.addUse('ti', 1) 
          break
        case 'doc': apiUsesSQLiteRepo.addUse('doc', 1)
          break
        case 'acessoria': apiUsesSQLiteRepo.addUse('acessoria', 1)
          break
        default: console.log('Invalid route!')
      }
    }
  }
}));

app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});