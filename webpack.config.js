const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const WebpackShellPlugin = require("webpack-shell-plugin");
const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = {
    mode: "development",
    entry: "./src/scripts/main.js",
    devServer: {
        writeToDisk: true,
        clientLogLevel: "error",
        stats: "errors-only",
        open: false,
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
                options: {
                    formatter: require("eslint/lib/cli-engine/formatters/stylish")
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    plugins: [
        new WebpackShellPlugin({
            onBuildEnd: ["json-server -p 8088 -w api/database.json"]
        }),
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
            inject: false
        }),
        new CopyPlugin([{ from: "./src/styles", to: "./styles" }]),
        new JavaScriptObfuscator ({
            rotateUnicodeArray: true
        }, [])
    ],
    output: {
        filename: "scripts/main.js"
    },
    devtool: false
};
