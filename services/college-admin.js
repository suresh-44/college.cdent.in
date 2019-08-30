/* eslint-disable max-len */
const crypto = require("crypto");

// Database modles
const TempModel = require("../database/models/temp-model");
const AdminModel = require("../database/models/admin-model");

// Utils
const reCaptcha = require("./utils/index").reCaptcha;

exports.checkExists = async (req) => {
	const uniqueString = req.params.uniqueString;
	if (uniqueString === 0) {
		throw new Error("Incorrect access.");
	}
	// Checking the unique String is exists in database
	const exists = await AdminModel.exists({uniqueString});

	if (!exists) {
		throw new Error("Entry not in database.");
	}
};

// Updating password for accepted college
exports.setPassword = async (req) => {
	const pwd = req.body.password;
	const rpwd = req.body.r_password;

	// recaptcha to prevent bots.
	const response = await reCaptcha(req);

	// Checking the response
	if (!response.data.success) {
		throw new Error(response.data["error-codes"]);
	} else {
		if (pwd !== rpwd) {
			throw new Error("Passwords doesn't match");
		}

		const uniqueString = req.params.uniqueString;
		try {
			await AdminModel.exists({uniqueString});
		} catch (e) {
			throw new Error(e);
		}

		const query = {uniqueString};
		const update = {
			password: pwd,
			accountValid: true,
			// uniqueString: 1,
		};
		// find and update the password
		AdminModel.findOne(query, (err, admin)=>{
			if (err) return new Error(err);
			admin.password = pwd;
			admin.accountValid = true;
			admin.save((err, newadmin)=> {
				if (err) return new Error(err);
				return newadmin;
			});
		});
	}
};

// eslint-disable-next-line valid-jsdoc
/**
 * @param {Object, Object} req, res
 * @param {String} req.body.email
 * @param {String} req.body.password
 * @description check the password is correct
 *@todo if password is correct then generate a jwt token for authentication
 * @return admin data || Error
 * */
exports.login = async (req, res) => {
	const email = req.body.email;
	const pwd = req.body.password;
	/* eslint-disable indent */
	const inputHash = crypto
										.createHash("sha512")
										.update(pwd, "utf-8")
										.digest("hex");

	const admin = await AdminModel.findOne({email});
	return new Promise((resolve, reject)=> {
		if (data) {
			if (admin.password === inputHash && admin.accountValid) {
				resolve(admin);
			} else {
				reject(new Error("Password is incorrect"));
			}
		} else {
			// TODO give valid response message
			// eslint-disable-next-line no-mixed-spaces-and-tabs
 			reject(new Error("Admin/Account is not found"));
		}
	});
};

exports.register = async (req, res) => {
	let tempModel;

	const response = await reCaptcha(req, res);
	// console.log(response);
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
			return tempModel.save();
		}
	}
};
