const axios = require("axios");

const TempModel = require("../database/models/temp-model");

const register = async (req, res) => {
	let tempModel;
	const secret = process.env.RECAPCTHA_SECRET;
	const recaptcha = req.body["g-recaptcha-response"];
	const userIP =
		req.headers["x-forwarded-for"] || req.connection.remoteAddress;

	const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${recaptcha}&remoteip=${userIP}`;

	const response = await axios.get(verificationURL);

	if (!response.data.success) {
		throw new Error(response.data["error-codes"]);
	} else {
		const temp = await TempModel.find({
			email: req.body.email,
		});

		if (temp.length > 0) {
			throw new Error("Email address already exists");
		} else {
			tempModel = new TempModel({
				name: req.body.name,
				email: req.body.email,
				role: req.body.role,
				phone_no: req.body.phone_no,
				collegeName: req.body.clgName,
				collegeAddr: req.body.clgAddr,
				collegeWebsite: req.body.clgUrl,
				authLetterFile: req.file.location,
			});
			return await tempModel.save();
		}
	}
};

module.exports = register;
