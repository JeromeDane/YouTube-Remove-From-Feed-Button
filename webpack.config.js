module.exports = {
    entry: "./src/userscript.user.js",
    output: {
        path: "./test",
        filename: "bundle.js"
    },
    module: {
		loaders: [
			{ test: /\.png$/, loader: "url-loader?mimetype=image/png" }
		]
	}
};