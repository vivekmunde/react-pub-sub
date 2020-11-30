const path = require('path');

module.exports = {
    mode: 'production',
    entry: './index.js',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    externals: {
        react: {
            commonjs: "react",
            commonjs2: "react",
            amd: "React",
            root: "React"
        },
        "react-dom": {
            commonjs: "react-dom",
            commonjs2: "react-dom",
            amd: "ReactDOM",
            root: "ReactDOM"
        }
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index.js',
        globalObject: 'this',
        library: 'react-pusu',
        libraryTarget: 'umd',
        publicPath: '/dist/',
        umdNamedDefine: true
    }
}