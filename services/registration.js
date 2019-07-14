const TempModel = require("../database/models/temp-model");

const upload = require("../utils/multer").single("file");

const register = async (req, res) => {
	let tempModel;
	upload(req, res, (err) => {
		if (err) {
			return new Error(err);
		}

		tempModel = new TempModel({
			name: req.body.name,
			email: req.body.email,
			role: req.body.role,
			collegeName: req.body.collegeName,
			collegeAddr: req.body.collegeAddr,
			collegeWebsite: req.body.collegeUrl,
			authLetterFile: req.file.destination + req.file.filename,
		}).save();
	});

	await tempModel;
	// TODO saving and validating but can't send error message if not validated
};

module.exports = register;
