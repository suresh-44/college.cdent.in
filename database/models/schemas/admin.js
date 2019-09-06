const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

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
 * generate the jwt token for authentication
 * @return {String} token generated jwt Token is saved in database and return
 */
collegeAdmin.methods.generateAuthToken = function() {
	const admin = this;
	const access = "auth";

	// create the jwt token
	const token = jwt.sign({
		// expire time for the token
		exp: ~~((Date.now() / 1000) + (60 * 60)), // valid only for 1hr
		_id: admin._id.toHexString(),
		access,
	}, process.env.JWT_SECRET, (err, token) => {
		if (!err && token) return token;
		else throw new Error(err);
	});

	// pushing the token to the database
	admin.tokens.push({access, token});

	// saving token in the database and return the token
	return admin.save().then(()=> {
		return token;
	});
};

/**
 * find the admin using provided token
 * @param {String} token
 * @return {Promise<admin>} admin
 */
collegeAdmin.statics.findByToken = async function(token) {
	const Admin = this;
	let decode;

	try {
		decode = jwt.verify(token, process.env.JWT_SECRET);
	} catch (e) {
		return Promise.reject(e);
	}

	return await Admin.findOne({
		"_id": decode.id,
		"tokens.token": token,
		"tokens.access": "auth",
	});
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

/**
 * Remove the token from the database
 * @param {String} token
 * @return {String} removed token from the database
 */
collegeAdmin.methods.removeToken = function(token) {
	// remove the token from database
	return this.update({
		$pull: {
			tokens: {
				token,
			},
		},
	});
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
