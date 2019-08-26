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
		type: Array,
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
	tokens: [{
		access: {
			type: String,
			required: true,
		},
		token: {
			type: String,
			required: true,
		},
	}],
});


/*
	* @function generateAuthToken
	* @description generate the token using jwt after we save it in database
	* and return the token
* */
collegeAdmin.methods.generateAuthToken = () => {
	const admin = this;
	const access = "auth";

	/* eslint-disable indent */
	const token = jwt.sign({
		// eslint-disable-next-line max-len
													exp: ~~((Date.now() / 1000) + (60 * 60)), // valid only for 1hr
		// eslint-disable-next-line max-len
													_id: admin._id.toHexString(), // to authenticate  logged in admin in other router
													access,
												}, process.env.JWT_SECRET, (err, token) => {
															if (!err && token) return token;
															else throw new Error(err);
													});

	admin.tokens.push({access, token});

	return admin.save().then(()=> {
		return token;
	});
};

/*
* @function removeToken()
* @param {String} token
* @description this function can be used to remove the token from database
* */
collegeAdmin.methods.removeToken = (token) => {
	return this.update({
		$pull: {
			tokens: {
				token,
			},
		},
	});
};

collegeAdmin.pre("save", async (next) => {
	const admin = this;
	/* eslint-disable indent */
	if (admin.isModified("password")) {
		admin.password = crypto
											.createHash("sha512")
											.update(pwd, "utf8")
											.digest("hex");
		next();
	} else {
		next();
	}
});

module.exports = collegeAdmin;
