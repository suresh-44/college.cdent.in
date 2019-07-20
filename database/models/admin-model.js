const mongoose = require("mongoose");
const admin = require("./schemas/admin");

const collegeDB = mongoose.connection.useDb("college");
const AdminModel = collegeDB.model("", admin);

module.exports = AdminModel;
