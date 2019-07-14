const crypto = require("crypto");

const hash = crypto.createHash("sha512");

const superAdminServices = {

	login: async (req, res) => {
		const inputPwdHash = hash.update(req.body.password, "utf8").digest("hex");
		if (process.env.SUPER_ADMIN_PWD === inputPwdHash) {
			//Password is correct Login user now

			let browser = req.headers["user-agent"];
			let userIP = req.header("x-forwarded-for") || req.connection.remoteAddress;
			let str = browser + userIP + inputPwdHash;

			req.session.login = true;
			req.session.superAdmin = true;
			req.session.user = req.body.username;
			req.session.secret = hash.update(str, "utf8").digest("hex");
			res.redirect("list/college/");
		} else {
			throw new Error("Incorrect Password or username");
		}
	},
	checkLogin: async (req, res) => {
		let browser = req.headers["user-agent"];
		let userIP = req.header("x-forwarded-for") || req.connection.remoteAddress;
		let str = browser + userIP + process.env.SUPER_ADMIN_PWD;
		let hash = hash.update(str, "utf8").digest("hex");

		if (!(req.session.login && req.session.superAdmin && hash === req.session.secret)) {
			res.redirect("/");
		}
	},
	logout: async (req) => {

	},
	getCollegeData: async () => {

	},
	acceptCollege: async (collegeID) => {

	},

};

module.exports = superAdminServices;
