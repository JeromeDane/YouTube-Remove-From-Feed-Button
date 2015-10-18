var fs = require("fs");

module.exports = function() {
	return JSON.parse(fs.readFileSync("./package.json", "utf8"));
};