const mongoose = require("mongoose");
const validator = require("validator");
const path = require("path");

const Utils = require(path.join(__dirname, "../../../services/utils/index"));

const collegeAdminSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		validate: {
			validator: validator.isEmail,
			message: "{VALUE} is not a valid email address.",
		},
	},
	password: {
		type: String,
		required: true,
		unique: true,
	},
	collegeName: {
		type: String,
		required: true,
		trim: true,
	},
	collegeAddr: {
		type: String,
		required: true,
		trim: true,
	},
	collegeWebsite: {
		type: String,
		required: true,
		trim: true,
		validate: {
			validator: validator.isURL,
			message: "{VALUE} is not a valid url",
		},
	},
	authLetterFile: {
		type: String,
		required: true,
		trim: true,
	},
	role: {
		type: Array,
		required: true,
		trim: true,
	},
	phone_no: {
		type: Number,
		required: true,
		trim: true,
	},
	accountValid: {
		type: Boolean,
		required: true,
	},
	paid: {
		type: Boolean,
		required: true,
	},
	validTill: {
		type: Date,
		required: false,
	},
	shortName: {
		type: String,
		required: true,
		trim: true,
	},
});

collegeAdminSchema.statics.findByCredentials = async function(email, password) {
	let admin;
	const hashPsw = Utils.createHash(password);
	try {
		// eslint-disable-next-line no-mixed-spaces-and-tabs
		admin = await this.findOne({email});
	} catch (e) {
		throw new Error("Email is incorrect");
	}

	if (admin.password === hashPsw) {
		return admin;
	} else {
		throw new Error("Password is incorrect");
	}
};

module.exports = collegeAdminSchema;
