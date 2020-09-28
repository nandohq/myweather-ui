const proxy = [
  {
    context: '/api',
    target: 'http://localhost:25314',
    pathRewrite: {'^/api' : ''}
  }
];

module.exports = proxy;
