const mongoose = require("mongoose");
// eslint-disable-next-line no-unused-vars
const collegeAdmin = require("./schemas/admin");


module.exports.collegeDB = (DB_NAME) => {
	const collegeDB = mongoose.connection.useDb(DB_NAME);
	const collegeAdmin = collegeDB.model("collegeAdmin", collegeAdmin);
	return {collegeAdmin};
};
