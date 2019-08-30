const axios = require("axios");
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
	const userIP =
		req.headers["x-forwarded-for"] || req.connection.remoteAddress;

	const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPCTHA_SECRET}&response=${recaptcha}&remoteip=${userIP}`;

	return axios.get(verificationURL);
};
