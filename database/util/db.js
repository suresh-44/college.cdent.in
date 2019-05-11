const mongoose = require("mongoose");

const dbURI = process.env.DATABASE_URL || "mongodb://localhost/";

const getDatabase = (dbName) => {
	const fullURI = dbURI + dbName;
	return mongoose.connect(fullURI, {useNewUrlParser: true});
};

const closeConnection = (mongooseConnection) => {
	mongooseConnection.close();
};

module.exports = {getDatabase, closeConnection};
