const mongoose = require("mongoose");
const admin = require("./schemas/admin");

const collegeDB = mongoose.connection.useDb("adminList");
const AdminListModel = collegeDB.model("adminModel", admin);

module.exports = AdminListModel;
