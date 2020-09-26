const path = require('path');
const fs = require("fs");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const samplePath = "./sample";
const buildDirName = "dist";

const demos = fs
    .readdirSync(path.join(__dirname, samplePath))
    .filter(name => fs.statSync(path.join(__dirname, samplePath, name)).isDirectory());

const entries = {};

demos.forEach(name => entries[name] = path.join(__dirname, samplePath, name, "index.ts"));


module.exports = {
    mode: "development",
    entry: entries,
    output: {
        path: path.resolve(__dirname, buildDirName),
        filename: "[name]/index.js",
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
    devServer: {
        contentBase: path.join(__dirname, buildDirName),
        compress: true,
        port: 9000
    },
    plugins: [],
}


demos.forEach(name => {
    const p = new HtmlWebpackPlugin({
        title: name,
        template: `./sample/${name}/index.html`,
        filename: `./${name}/index.html`,
        minify: {
            removeComments: true,
            collapseWhitespace: true
        },
        chunks: ["index"],
        inlineSource: '.(js|css)$',
    });

    module.exports.plugins.push(p);
});
