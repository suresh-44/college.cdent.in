const mongoose = require("mongoose");

// database models
const collegeAdminList = require("./adminList-model");
const collegeAdminSchema = require("./schemas/college-schema");

module.exports.getcollegeDB = async (DB_NAME) => {
	// console.log(DB_NAME);
	const exist = await collegeAdminList.exists({shortName: DB_NAME});
	if (!exist) throw new Error("Invalid access");
	return mongoose.connection.useDb(DB_NAME);
};

module.exports.getCollegeAdminModel = async (DB_NAME) => {
	return DB_NAME.model("collegeAdmin", collegeAdminSchema, "collegeAdmin");
};

// create the database when admin created is password
module.exports.createCollegeDB = async (DB_NAME) => {
	return mongoose.connection.useDb(DB_NAME);
};

// Todo create the others schema
// module.exports.getCollegeDeptModel = async (DB_NAME) => {
// 	return DB_NAME.model("collegeAdmin", collegeAdminSchema);
// };
//
// module.exports.getCollegeFacModels = async (DB_NAME) => {
// 	return DB_NAME.model("collegeAdmin", collegeAdminSchema);
// };
