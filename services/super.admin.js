const crypto = require("crypto");
const utils = require("./../utils");
const mailer = require("./mailer");

const TempModel = require("../database/models/temp-model");
const AdminModel = require("../database/models/admin-model");

const superAdminServices = {
	login: async (req, res) => {
		const inputPwdHash = crypto
			.createHash("sha512")
			.update(req.body.password, "utf8")
			.digest("hex");

		if (process.env.SUPER_ADMIN_PWD === inputPwdHash) {
			// Password is correct Login user now

			const browser = req.headers["user-agent"];
			const userIP =
				req.header("x-forwarded-for") ||
				req.connection.remoteAddress + inputPwdHash;
			const str = browser + userIP;
			const secret = crypto.createHash("sha512").update(str, "utf8");
			req.session.login = true;
			req.session.superAdmin = true;
			req.session.user = req.body.username;
			req.session.secret = secret.digest("hex");
			res.redirect("admin/dashboard/");
		} else {
			throw new Error("Incorrect Password or username");
		}
	},
	checkLogin: async (req, res) => {
		const browser = req.headers["user-agent"];
		const userIP =
			req.header("x-forwarded-for") || req.connection.remoteAddress;
		const str = browser + userIP + process.env.SUPER_ADMIN_PWD;
		const loginHash = crypto.createHash("sha512")
			.update(str, "utf8")
			.digest("hex");
		if (
			!(
				req.session.login &&
				req.session.superAdmin &&
				loginHash === req.session.secret
			)
		) {
			res.redirect("/super/admin");
		}
	},
	logout: (req, res) => {
		req.session.login = false;
		req.session.superAdmin = false;
		req.session.user = null;
		req.session.secret = null;
		res.redirect("/");
	},
	getCollegeData: async () => {
		return TempModel.find();
	},
	removeCollege: async (req, res) => {
		const id = req.params.id;
		await TempModel.findByIdAndRemove(id);
	},
	acceptCollege: async (collegeID) => {
		// GET old data
		const data = await TempModel.find(collegeID);

		// && Generate a link to send as email
		const uniqueString = utils.randomString(16);
		const link = "https://college.cdent.co.in/" + "/account/create/" + uniqueString;

		const adminModel = new AdminModel({
			name: data.name,
			email: data.email,
			phone_no: data.phone_no,
			collegeName: data.collegeName,
			collegeAddr: data.collegeAddr,
			collegeWebsite: data.collegeWebsite,
			authLetterFile: data.authLetterFile,
			role: data.role,
			uniqueString: uniqueString,
			accountValid: false,
			paid: false,
		});

		await adminModel.save();

		const body = "Your account is accepted. Activate your account at " + link;

		mailer.sendTextMail(data.email,
			"Account accepted. Activation required",
			body);
	},
};

module.exports = superAdminServices;
