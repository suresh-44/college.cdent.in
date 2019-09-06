const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");

const collegeAdmin = new mongoose.Schema({
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
		required: false,
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
		type: String,
		required: true,
		trim: true,
	},
	phone_no: {
		type: Number,
		required: true,
		trim: true,
	},
	uniqueString: {
		type: String,
		unique: true,
		required: true,
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
});

const createHash = (key) => {
	return crypto
		.createHash("sha512")
		.update(key, "utf8")
		.digest("hex");
};

/**
 *
 * @param {String} email to find the admin
 * @param {String} password for validation
 * @return {Promise<admin>} if successfully verify the password
 */
collegeAdmin.statics.findByCredentials = async function(email, password) {
	let admin;
	const hashPsw= createHash(password);
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

// hash the password before saving to the database
collegeAdmin.pre("save").then(function() {
	const admin = this;
	if (admin.isModified("password")) {
		admin.password = createHash(admin.password);
		next();
	} else {
		next();
	}
});

module.exports = collegeAdmin;
