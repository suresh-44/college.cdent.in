const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);

const connectDB = () => {
	const uri = process.env.DATABASE_URL || "mongodb://localhost/default";
	return mongoose.connect(uri);
};

const disconnectDB = () => {
	return mongoose.connection.close();
};

module.exports = {connectDB, disconnectDB};
