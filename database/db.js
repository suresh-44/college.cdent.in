const mongoose = require("mongoose");

const connectDB = () => {
	const uri = process.env.DATABASE_URL || "mongodb://localhost/default";
	return mongoose.connect(uri, {useNewUrlParser: true});
};

const disconnectDB = () => {
	return mongoose.connection.close();
};

module.exports = {connectDB, disconnectDB};
