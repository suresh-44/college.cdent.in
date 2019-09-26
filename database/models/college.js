const mongoose = require("mongoose");
// eslint-disable-next-line no-unused-vars
const collegeAdminSchema = require("./schemas/college-admin");

module.exports.getcollege = (DB_NAME) => {
	// console.log(DB_NAME);
	return mongoose.connection.useDb(DB_NAME);
};

module.exports.getCollegeAdminModel = async (DB_NAME) => {
	return DB_NAME.model("collegeAdmin", collegeAdminSchema,"collegeAdmin");
};

// Todo create the others schema
// module.exports.getCollegeDeptModel = async (DB_NAME) => {
// 	return DB_NAME.model("collegeAdmin", collegeAdminSchema);
// };
//
// module.exports.getCollegeFacModels = async (DB_NAME) => {
// 	return DB_NAME.model("collegeAdmin", collegeAdminSchema);
// };
