const transporter = require("./mail-config");

const mailer = {
	sendTextMail: (to, subject, body, callback) => {

		const data = {
			from: "cDent Admin <admin@cdent.co.in>",
			to: to,
			subject: subject,
			text: body,
		};

		transporter.sendMail(data, callback);
	},
};

module.exports = mailer;
