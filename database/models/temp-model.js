const mongoose = require("mongoose");
const tempAdmin = require("./schemas/temp-admin");

const tempDB = mongoose.connection.useDb("temp");
const TempModel = tempDB.model("tempAdmin", tempAdmin);

module.exports = TempModel;
