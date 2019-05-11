const TempModel = require("../database/models/temp-model");

const register = async (data, file) => {

	const tempModel = new TempModel({
		name: data.adminName,
		email: data.adminEmail,
		collegeName: data.collegeName,
		collegeAddr: data.collegeAddr,
		collegeWebsite: data.collegeWebsite,
		authLetterFile: file.name,
	});

	//TODO save the file in temp folder and store the name in db.
	//TODO validate and save the details in the database: On success, do nothing & On error throw the error messages.

};

module.exports = register;
