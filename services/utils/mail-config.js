const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	sendmail: true,
	newline: "unix",
	path: "/usr/sbin/sendmail",
});

module.exports = transporter;
