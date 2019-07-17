const axios = require('axios');

const TempModel = require("../database/models/temp-model");

const upload = require("../utils/multer").single("file");

const register = async (req, res) => {
	let tempModel;
	upload(req, res, (err) => {
		if (err) {
			return new Error(err);
		}


		const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + process.env.RECAPCTHA_SECRET + "&response=" + req.body['g-recaptcha-response'];
	
	
		axios.get(verificationURL).then(body => {
			if(!body.data.success){
				return new Error(body.data['error-codes'])
			}
	
			tempModel = new TempModel({
				name: req.body.name,
				email: req.body.email,
				role: req.body.role,
				phone_no: req.body.phone_no,
				collegeName: req.body.clgName,
				collegeAddr: req.body.clgAddr,
				collegeWebsite: req.body.clgUrl,
				authLetterFile: req.file.destination + req.file.filename,
			}).save();
		})
		
		
	});

	await tempModel;
	// TODO saving and validating but can't send error message if not validated
};

module.exports = register;
