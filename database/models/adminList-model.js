const mongoose = require("mongoose");
const adminListModel = require("./schemas/adminList");

const collegeDB = mongoose.connection.useDb("adminList");
const AdminListModel = collegeDB.model("adminListModel", adminListModel);

module.exports = AdminListModel;
