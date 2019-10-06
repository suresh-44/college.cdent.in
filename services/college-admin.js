// Database modles
const TempModel = require("../database/models/temp-model");
const AdminModelList = require("../database/models/adminList-model");
const college= require("../database/models/college");

// Utils
const Utils = require("./utils/index");

exports.checkExists = async (req) => {
	const uniqueString = req.params.uniqueString;
	console.log(uniqueString);
	if (!uniqueString) {
		throw new Error("Incorrect access.");
	}
	// Checking the unique String is exists in database
	const exists = await AdminModelList.exists({uniqueString});
	console.log(exists);
	if (!exists) {
		throw new Error("Invalid access");
	}
};

// Updating password for accepted college
exports.setPassword = async (req, res) => {
	const pwd = req.body.password;
	const rpwd = req.body.r_password;
	const shortName = req.body.short_name || "vvce";

	// recaptcha to prevent bots.
	const response = await Utils.reCaptcha(req);

	// // Checking the response
	if (!response.data.success) {
		throw new Error(response.data["error-codes"]);
	} else {
		if (pwd !== rpwd) {
			throw new Error("Passwords doesn't match");
		}
		// TODO Give some good responses back
		const uniqueString = req.params.uniqueString;
		try {
			const exist = await AdminModelList.exists({uniqueString});
			if (!exist) throw new Error("Invalid access");

			// find and update the password
			const admin = await AdminModelList.findOne({uniqueString});

			const collegeDB = college.getcollege(shortName);
			const collegeAdmin = await college.getCollegeAdminModel(collegeDB);

			admin.password = Utils.createHash(pwd);
			admin.paid = false;
			admin.shortName = shortName;
			// admin.uniqueString = 1;
			const newAdmin = {
				role: admin.role,
				name: admin.name,
				email: admin.email,
				phone_no: admin.phone_no,
				collegeName: admin.collegeName,
				collegeAddr: admin.collegeAddr,
				collegeWebsite: admin.collegeWebsite,
				authLetterFile: admin.authLetterFile,
				accountValid: false,
				paid: false,
				password: Utils.createHash(pwd),
				shortName,
			};
			// eslint-disable-next-line no-mixed-spaces-and-tabs,new-cap,max-len
			await admin.save();
			// eslint-disable-next-line new-cap,max-len
			await new collegeAdmin(newAdmin).save();
		} catch (e) {
			throw new Error(e.message);
		}
	}
};

// eslint-disable-next-line valid-jsdoc
/**
 * @param {Object, Object} req, res
 * @param res
 * @param collegeDB
 * @param {String} req.body.email
 * @param {String} req.body.password
 * @description check the password is correct then create a new session
 * @return admin data || Error
 * */
exports.login = async (req, res, collegeDB) => {
	const email = req.body.email;
	const pwd = req.body.password;
	const role = req.body.role;
	console.log(pwd);
	let user;
	let MODEL;
	// let department;

	if (!role) {
		throw new Error("Role is required!");
		// res.send("role is undefined");
	} else {
		try {
			if (role === "college_admin") {
				MODEL = await college.getCollegeAdminModel(collegeDB);
				user = await MODEL.findByCredentials(email, pwd);
				await Utils.sessions(req, user, "College-Admin");
			} else if (role === "Department-Admin") {
				// department = req.body.department;
				//	TODO create department admin module
			} else {
				// TODO create Faculty module
			}
		} catch (e) {
			throw new Error(e.message);
		}
	}
};

exports.register = async (req, res) => {
	let tempModel;

	const response = await Utils.reCaptcha(req, res);
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
