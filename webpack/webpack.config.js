const common = require('./webpack.common');

module.exports = (_env, { mode = 'production' } = {}) => common(mode);
