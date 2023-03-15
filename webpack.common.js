
const merge = require('webpack-merge');


const baseConfig =  require('./webpack.config.dev');
module.exports = (env, args)=> {
    const configEnv = env.development ? 'development' : 'production';
    const config = require(`./webpack.${configEnv}.js`)
    return merge(baseConfig, config)
};
