// Database modles
const TempModel = require("../database/models/temp-model");
const AdminModelList = require("../database/models/adminList-model");
const college= require("../database/models/college");

// Utils
const Utils = require("./utils/index");

exports.checkExists = async (req) => {
	const uniqueString = req.params.uniqueString;
	if (uniqueString === 0) {
		throw new Error("Incorrect access.");
	}
	// Checking the unique String is exists in database
	const exists = await AdminModelList.exists({uniqueString});

	if (!exists) {
		throw new Error("Entry not in database.");
	}
};

// Updating password for accepted college
exports.setPassword = async (req, res) => {
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
		// TODO Give some good responses back
		const uniqueString = req.params.uniqueString;
		try {
			const exist = await AdminModelList.exists({uniqueString});
			if (!exist) return res.redirect("404");
			const query = {uniqueString};
			// find and update the password
			const admin = await AdminModelList.findOne(query);
			if (!admin) return new Error("url is expired");

			// AdminModelList.findByIdAndUpdate(admin.id, )
			admin.password = Utils.createHash(pwd);
			admin.paid = false;

			// eslint-disable-next-line no-mixed-spaces-and-tabs
			await admin.save();
		} catch (e) {
			return new Error(e.message);
		}
	}
};

// eslint-disable-next-line valid-jsdoc
/**
 * @param {Object, Object} req, res
 * @param res
 * @param collegeName
 * @param {String} req.body.email
 * @param {String} req.body.password
 * @description check the password is correct then create a new session
 * @return admin data || Error
 * */
exports.login = async (req, res, collegeDB) => {
	const email = req.body.email;
	const pwd = req.body.password;
	const role = req.body.role;

	let user, model;
	// let department;
	try {
		if (!role) {
			return new Error("Role is required!");
		} else {
			if (role === "College_Admin") {
				model = await college.getCollegeAdminModel(collegeDB);
				user = await AdminModelList.findByCredentials(email, pwd);
				await Utils.sessions(req, user, "College-Admin");
				res.redirect(`/${collegeName}/admin/dashboard`);
			} else if (role === "Department-Admin") {
				// department = req.body.department;
				//	TODO create department admin module
			} else {
				// TODO create Faculty module
			}
		}
	} catch (e) {
		return new Error(e.message);
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
