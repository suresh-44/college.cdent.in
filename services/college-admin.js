const crypto = require("crypto");
const AdminModel = require("../database/models/admin-model");

const collegeAdmin = {

	checkExists: async (req) => {
		const uniqueString = req.params.uniqueString;
		if (uniqueString === 0) {
			throw new Error("Incorrect access.");
		}
		const exists = await AdminModel.exists({uniqueString: uniqueString});
		if (!exists) {
			throw new Error("Entry not in database.");
		}
	},

	setPassword: async (req) => {
		const pwd = req.body.password;
		const rpwd = req.body.r_password;

		// TODO also add a recaptcha to prevent bots.

		if (pwd !== rpwd) {
			throw new Error("Passwords doesn't match");
		}

		const uniqueString = req.params.uniqueString;
		try {
			await this.checkExists(req);
		} catch (e) {
			throw new Error(e);
		}

		const pwdHash = crypto
			.createHash("sha512")
			.update(pwd, "utf8")
			.digest("hex");

		const query = {uniqueString: uniqueString};
		const update = {
			password: pwdHash,
			accountValid: true,
			uniqueString: 1,
		};
		await AdminModel.findOneAndUpdate(query, update);
	},


	login: async (req, res) => {
		const email = req.body.email;
		const pwd = req.body.password;
		const inputHash = crypto.createHash("sha512")
			.update(pwd, "utf-8")
			.digest("hex");

		// eslint-disable-next-line  no-unused-vars
		const query = {email: email, password: inputHash};
		// const data = await AdminModel.findOne(query);
		// TODO check if password is correct
		// if correct check if payment is done.
		// if payment is done redirect to /admin/dashboard
		// else redirect to /admin/pay
	},

};

module.exports = collegeAdmin;
