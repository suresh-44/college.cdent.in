const loginHelper = require("./../utils/login-helper");

const protectedURLs = [
	"^\/[A-Za-z]+\/dashboard$",
];

const URLAllowedFor = {};
URLAllowedFor[protectedURLs[0]] = ["college-admin"];

const isAccessIsAllowed = (allowedAccessLevel, currentURLLevel) => {
	// TODO add proper access level check.
	return true;
};

module.exports = async (req, res, next) => {
	const url = req.url;
	console.log("Called login middleware");
	for (const str of protectedURLs) {
		if (str === url || str.match(str)) {
			const loginData = await loginHelper.checkLogin(req);
			if (loginData.loggedIN === false) {
				res.redirect("/login");
			} else if (isAccessIsAllowed(URLAllowedFor[str], loginData.accessLevel) !== true) {
				res.redirect("/login");
			} else {
				next();
			}
		}
	}
	next();
};
