const mongoose = require("mongoose");
const validator = require("validator");

const tempAdmin = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique : true,
		trim: true,
		validate: {
			validator: validator.isEmail,
			message: "{VALUE} is not a valid email address.",
		},
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
	role : {
		type : String,
		required : true,
		trim : true
	}
});

module.exports = tempAdmin;
