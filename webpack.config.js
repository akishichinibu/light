const path = require('path');

const buildDirName = "dist";

module.exports = {
    mode: "development",
    entry: "./src/main.ts",
    output: {
        path: path.resolve(__dirname, buildDirName),
        filename: "light.bundle.js",
        library: "kernel",
        libraryTarget: "umd",
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
}
