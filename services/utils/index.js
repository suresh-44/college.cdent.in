const rp = require("request-promise");
const crypto = require("crypto");

const transporter = require("./mail-config");

exports.mailer = {
	sendTextMail: (to, subject, body, callback) => {
		const data = {
			from: "cDent Admin <admin@cdent.co.in>",
			to: to,
			subject: subject,
			text: body,
		};
		// console.log(data)
		transporter.sendMail(data, callback);
	},
};

// Google reCaptcha
exports.reCaptcha = async (req) => {
	const recaptcha = req.body["g-recaptcha-response"];

	const verificationURL = "https://www.google.com/recaptcha/api/siteverify";
	const postData = {
		secret: process.env.RECAPTCHA_SECRET,
		response: recaptcha,
	};
	const options = {
		method: "POST",
		uri: verificationURL,
		form: postData,
		json: true,
	};

	try {
		const response = await rp(options);
		if (response.success !== true) {
			return response["error-codes"];
		}
		return true;
	} catch (e) {
		return new Error(e);
	}
};

exports.sessions = async (req, user) => {
	const role = user.role;

	const browser = req.headers["user-agent"];
	const userIP =
		req.header("x-forwarded-for") ||
		req.connection.remoteAddress + user.password;
	const str = browser + userIP;
	const secret = crypto.createHash("sha512").update(str, "utf8");
	req.session.login = true;
	req.session.user_id = user._id;
	req.session.username = user.name;
	req.session.role = role;
	req.session.secret = secret.digest("hex");
};

exports.createHash = (key) => {
	return crypto
		.createHash("sha512")
		.update(key, "utf8")
		.digest("hex");
};
