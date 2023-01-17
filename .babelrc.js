module.exports = function babel(api) {
	const BABEL_ENV = api.env();
	const presets = ["solid", "@babel/preset-typescript"];
	const plugins = [];

	if (BABEL_ENV === "development") {
		// plugins.push("react-refresh/babel");
	}

	return {
		presets,
		plugins,
	};
};
