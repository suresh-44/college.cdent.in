const crypto = require("crypto");
const AdminModel = require("../database/models/admin-model");

const collegeAdmin = {

	checkExists: async (req) => {
		let uniqueString = req.params.uniqueString;
		if (uniqueString === 0) {
			throw new Error("Incorrect access.");
		}
		let exists = await AdminModel.exists({uniqueString: uniqueString});
		if (!exists) {
			throw new Error("Entry not in database.");
		}
	},

	setPassword: async (req) => {
		let pwd = req.body.password;
		let rpwd = req.body.r_password;

		// TODO also add a recaptcha to prevent bots.

		if (pwd !== rpwd) {
			throw new Error("Passwords doesn't match");
		}

		let uniqueString = req.params.uniqueString;
		try {
			await this.checkExists(req);
		} catch (e) {
			throw new Error(e);
		}

		const pwdHash = crypto
			.createHash("sha512")
			.update(pwd, "utf8")
			.digest("hex");

		let query = {uniqueString: uniqueString};
		let update = {
			password: pwdHash,
			accountValid: true,
			uniqueString: 1,
		};
		await AdminModel.findOneAndUpdate(query, update);
	},

	login: async (req, res) => {
		let email = req.body.email;
		let pwd = req.body.password;
		let inputHash = crypto.createHash("sha512")
			.update(pwd, "utf-8")
			.digest("hex");

		let query = {email: email, password: inputHash};
		let data = await AdminModel.findOne(query);
		//TODO check if password is correct
		// if correct check if payment is done.
		// if payment is done redirect to /admin/dashboard
		// else redirect to /admin/pay
	},

};

module.exports = collegeAdmin;
